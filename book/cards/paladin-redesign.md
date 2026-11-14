# The Paladin redesign: the decisions, one at a time

The running record of the Paladin's redesign (MASTER-PLAN item 5; branch `pack-paladin-redesign`). One decision at a time: Claude proposes or analyses Lucas's draft, **Lucas decides**, the decision is written here. **Nothing here is in the book or in Foundry until Lucas says so.** The card analyses use the format of `paladin-analyses.md` (priced lines tagged [SIM] / [Lucas] / [judgment] / [not priced], a total, then the analysis); the research is in `book/research/`; the charter is `book/class-charter.md`.

**For Lucas, the readable version of all this:** the reading page "Paladin Redesign Desk", https://claude.ai/artifact/NUn8zUNb2mRQZZ7N8HfBaA (its source: `book/cards/desk/index.html`; Claude updates it after every decision). It holds what is decided, the open questions with examples, and the research in ten points.

## The brief (Lucas, 2026-11-14)

> The paladin is a soft tank, soft support, soft nova class, focusing in divine action against profane forces. The paladin isn't a consistent damage dealer nor can take hits for you, but they can aid you, make sure you don't go down and when they use all they have against an enemy, they can explode before seeing it coming. They stay in front so the squishes can stay back.

**The brief against the research and our rules, in short** (the detail: the five notes of 2026-11-14):

| The brief | What it asks for | Where our rules stand today |
|---|---|---|
| soft tank; "can't take hits for you" | protect by making one hit a round smaller or costly, never by soaking it | Shield of Faith is the right shape at four times its budget (66 points; fires 82% of rounds, on himself too) |
| "they stay in front so the squishies can stay back" | a front line the rules make real: a move that ends or costs more next to him. **And a tension:** a protector by Reaction works on an ally close enough to be hit (Champion players: "works best if someone else is in melee range"), so he needs both a Reaction for the ally beside him and a stop for the enemy heading to the one who stayed back | **nothing**: no Opportunity Attack at Stage 0, no zone of control; only Frightened of you (Difficult Terrain toward him) on Rebuke's Tier 1. Our Reactions reach 5 squares, which covers an Archer a move behind him |
| soft support; "make sure you don't go down" | the cheapest, fastest Rally Point in the party, on the touch or on the hit; big enough before 0 | Lay On Hands 1 AP is worth less than the attack it replaces (-11); Divine Intervention is a Daily (none in Stage 0) |
| soft nova; "use all they have... explode" | one Action, built in the open during the fight, 1.5 to 2.5 times its AP's worth of normal hits (13th Age's designer: 1.5 a battle, 2 a day), a floor on Tier 1, best as a finisher, a visible cost afterwards; a slow build has a price in a 3.5-round fight | **no nova**: Holy Wrath 2 is 50 points, the same as Smite 2; Smite every round is a consistent damage dealer's card |
| "divine action against profane forces" | always works, a little more against the Profane; the player declares whom he judges | Divine Power does nothing without a Profane creature; the Tag list isn't written |
| three roles in one class | one spine of its own; the parts feed each other | the Hallmark choice splits the class in two (the SIM's 115 and 161 points at level 2) |

## The order

1. **The class's numbers** (Modifiers, Health, Rally, Speed): decision 1, below.
2. The level 1 picks, one by one: the two Features, each Hallmark Action, each Hallmark Reaction, the Arts.
3. The Escalation Passives, one by one (2, 4, 6), and the hook.
4. The Encounter Picks.

## Decision 1: the class's numbers (DECIDED, Lucas, 2026-11-14)

**Research first.** The 4e Paladin's split attack stats are remembered as its worst fault (`paladins-other-games.md`, takeaway 10). The closest published match to the brief, Draw Steel's Censor, has a front-liner's Stamina and the most Recoveries: tough across the day, not in the round (`frontline-protection.md`, takeaway 4). High defenses are half of the protector's trap: "attack my allies and take the reaction, or attack durable me" (`paladins-other-games.md`, the Champion). The 4e Paladin's other launch flaw was a duty to chase on the slowest class: the cure was to drop the duty, not to raise the Speed.

| Number | Today | Proposed | Why | Source of the size |
|---|---|---|---|---|
| **Modifiers** | +2 and +1, you choose | **Weapon +1, Power +2, fixed** | "Isn't a consistent damage dealer": his plain Weapon Attack rolls +1, a full step under the Archer's. His divine Actions roll Power +2, and a divine Strike with the [Signature] trait rolls +2 (the higher of the two): the burst hits like a striker's, the everyday swing doesn't. Ward Defense 13. One build, so no card is written for a Modifier half the Paladins don't have. | +1 on a Modifier = a full step of difficulty [Lucas, 2026-11-12]; about 9% of a roll's worth, so a Weapon Attack about 23 points instead of 25 [judgment, from the old price list] |
| **Health** | high 20, low 10 | **keep 20 / 10** | A Human: 35 against the Archer's 29 (+21%). A Standard's turn deals him 11.9: three turns of one Standard's whole attention. Enough to stand in front, not enough to soak for two. | [SIM] `stage0.md` section 2; the old charter's role budget was 120 to 130% |
| **Rally** | 6 (7 Rally Points; each heals 9) | **keep 6 for now; +1 if his own Rally Points pay for allies** | His reserve is 63 Health a day against the Archer's 48: the "depth, not height" of the Censor is already here. Whether Lay On Hands spends his or the ally's is a later decision (`frontline-protection.md`, takeaway 6); if his, Rally becomes his tank stat and 7 is the default. | [judgment] 1 Rally Point = 5 points [Lucas's rate]; about 12 a Health when it lands in a fight [SIM] |
| **Speed Modifier** | +0 | **keep +0** | He holds a place; the Archer (+1) moves. With an Advance in one piece he gets one move a turn: his cards must not ask him to chase ("while you are adjacent to it" is the 4e flaw). Mobility, where he needs it, comes from a card (a step to the ally who is hit). | [SIM] +1 Speed on a Paladin: 0.1 damage-equivalents over 3 rounds on the open field, 1.4 to 1.5 on maps (`maps.md`) |
| **Armor Training** | Heavy (AD 14) | **keep Heavy** | Attacking him is the bad choice; so the enemy attacks his ally, where his Reaction is. | [SIM] a Standard deals 11.9 a turn to AD 14, 13.3 to AD 13 |
| **Attributes** | Body or Appeal +1, Mind or Instinct +1 | unchanged | Attributes are for Skills, Saves and Checks; not part of this pass. | |

**Total [judgment]:** against today's Smite build (Weapon +2) this is about -5 points on a turn of plain attacks and +1 Ward Defense; against today's Lay On Hands build (Power +2) it is the same character. The class's 130 / 140 / 150 comes from its cards.

**Analysis.**
- **The decision it gives the player:** none, on purpose. Today "which Modifier is your Weapon Modifier" is the first choice a Paladin makes, and it decides whether half the class's cards are good for him. With one line, the choices move to the cards.
- **The rules it touches:** Chapter 5's example (Lonny's Paladin: Weapon +2, Power +1) and the Paladin's statblock line. At Stage 1 he still adds +1 to the one he chooses: Weapon +2 / Power +2, or Power +3.
- **Its sibling:** the Archer is Weapon +2, Power +1, fixed. The two classes become mirror images: the Archer's weapon is his constant, the Paladin's Power is.
- **Table feel:** his sword misses more than the Archer's bow. That reads as "not the damage dealer" every round, and makes the turn he calls on his god (a [Signature] Strike at +2, with whatever Boons the party set up) feel different in the dice, not only in the damage. The risk: missing is the least fun result. It is softened by the three Tiers (his big Strikes deal damage on Tier 1) and by giving his turn other jobs than the Weapon Attack.
- **What the checked research adds (second pass):** a protector with no threat gets ignored. A Pathfinder 2e Guardian playtester: the taunt "seemed to work as intended... if the intent was the enemy ignored the taunt", "piddly damage, which means there was not really a reason for the monsters to attack me". One guide's cure is the opposite of your brief ("put down your shield and grab a two-handed weapon"). The 4e Swordmage shows the other cure: he does little damage and is still obeyed, because "preventing 8 damage from my marked target is enough to draw them to me". **So Weapon +1 is safe only if the next decisions give him a punishment or a protection that is certain (no roll) and has a number the table hears.** If you want his threat to come from his sword instead, pick (C).
- **If you'd rather not:** (B) keep "+2 and +1, you choose": two builds stay possible, and every Paladin card must be checked for both. (C) Weapon +2, Power +1, fixed, as the Archer: the plain attack is as good as the Archer's and "isn't a consistent damage dealer" must then come from the cards alone (no bonus damage outside the burst).

**Lucas's answer (2026-11-14): all as proposed.** Modifiers: Weapon +1, Power +2, fixed. Health 20 / 10. Rally 6. Speed +0. Heavy. Attributes unchanged.

**And a direction with it (Lucas):** "Using rally points for allies I think its more of a cleric thing. So lets try to make Paladin not have this too much; can gave some but not too much." So: the Paladin's "aid you, make sure you don't go down" is **not** built on letting allies use Rally Points (a future Cleric's job). At most one of his cards touches an ally's Rally Points; the rest of his support is something else (to settle with Lucas: Guard, a hit made smaller, a step, a condition ended, a drop at 0 stopped). It also closes the "whose reserve pays" question for now: Rally stays 6. Lay On Hands as written (a Rally Point every round) doesn't fit this Paladin.

## Directions from Lucas (2026-11-14, with his charter answers)

- **His support is a smaller hit, or Guard before the hit.** "Step out of reach is more a skirmishing thing, condition ended and drop at 0 stopped a healer thing."
- **No number of his own:** the burst is built from what is on the sheet (AP, the Reaction AP, Escalation read but never spent).
- **An Art has up to 3 uses**, to try; one is cut if it feels too much.

## Decision 2: the first Feature, the mark (DECIDED, Lucas, 2026-11-14; the final card is at the end of this section)

**Research first.** Every modern paladin hangs on one enemy he marks (4e's Divine Challenge, 13th Age's Paladin's Challenge, Pathfinder 2e's Smite, Draw Steel's Judgment). The marks that worked are certain (no roll), cheap to place, and ask no upkeep the enemy controls: 4e's failed while it asked the slowest class to stay adjacent. A protector with little damage is obeyed only when his protection has a number the table hears (the 4e Swordmage: "preventing 8 damage from my marked target is enough to draw them to me"; the Pathfinder 2e Guardian's soft taunt on "piddly damage" was ignored). A type gate fails (Divine Power today): the judged enemy can count as Profane.

> **Judgment** (Paladin Feature)
> You gain the Judge Action.
>
> **Judge** · 0 AP / 1 AP · Turn · [Divine] · Distance 10 sq. · Target: one enemy you can see
> **0 AP:** At the start of an encounter, or as a 0R when the creature you Judged goes Down: the target is **Judged** by you until the encounter ends.
> **1 AP:** The target is Judged by you instead of the one you had.
> A creature Judged by you counts as Profane for you. The first time each round it damages an ally within 5 squares of you, that damage is reduced by your Power Modifier.
>
> *Flavor: You name it before your god. From that moment, it is watched.*

```
Judged; counts as Profane for you ........................ not priced (0 by itself: it is the key other cards turn)
The first hit a round on an ally within 5: reduced by 2 .. 24 each time   [SIM: 1 Health = 12]
  x it happens in about 40% of rounds against Standards ... about 10 a turn   [judgment: Rebuke's "an enemy within 5 Strikes an ally" fires in 66% of rounds for ANY enemy; one chosen enemy of four, picked well, about 40%]
  x against an Elite (it is most of the enemy's attacks) .. about 80%: about 19 a turn   [judgment]
The enemy hits the Paladin instead (AD 14, not 13) ....... about 1 to 2 a turn   [SIM: a Standard deals 11.9 a turn to him, 13.3 to an Archer]
0 AP to place; 1 AP to move it ........................... no cost on most turns
--- Total: about 10 a turn against Standards, about 19 against an Elite, of a Feature's 10 to 15 [a guess]: on
```

**Analysis.**
- **The decision it gives:** whom to judge. The biggest hitter (the reduction is flat, so it is worth most on many small hits and least on one big Special), or the enemy standing next to the Archer. Moving it costs 1 AP, so the first choice matters; when the Judged creature goes Down it moves for free, at once.
- **It is certain and it has a number.** No roll, no Reaction AP, nothing to remember on the Paladin's side but "minus 2, once a round". At Stage 0 a Standard's Basic attack is 1 + 1d4 (3.5) on a Tier 2: minus 2 is more than half of it. Against its Special (4 + 1d6) it is a quarter. It scales with the Power Modifier (3 at Stage 1 if he raises it).
- **It asks nothing the enemy controls.** No "stay adjacent to it". The one distance is the ally's from him (5 squares), which is the brief: he stands where his allies are. The Judged creature can be anywhere.
- **It is your support direction, small:** a smaller hit. The Hallmark Reaction is then the big version (a smaller hit or Guard, once, with a rider), on any enemy; this is the always-on trickle on one.
- **Both of the enemy's choices cost it:** hit his ally for less, or hit him (AD 14, the most Health). Small at Stage 0, and that is the point of "soft".
- **Profane, for every campaign:** "counts as Profane for you" makes every later "against a Profane creature" line work on the enemy he chose, and still work on a real Profane creature he hasn't judged. Divine Power (a Bane on a Profane creature's Strikes) is retired.
- **Its sibling:** the Archer's Mark Quarry has the same frame (0 AP at the start, 0R when it goes Down, 1 AP to change), so the two classes teach one pattern, and Foundry already runs it. The Archer marks to hurt; the Paladin marks to shield.
- **The rules it touches:** "Judged" as a named mark (like Marked Quarry, not a Chapter 8 condition); one sentence in Chapter 7's Tags ("an effect can make a creature count as having a Tag for someone"); reduced damage comes before Guard (Chapter 4 already says so).
- **Table feel:** the Paladin's first turn has a job that isn't an attack ("I judge the ogre"), and the GM hears "minus 2" every round the ogre goes for someone else. The risk: the GM must remember "once a round" for that creature (Foundry can do it: the damage-reduction setting and the mark both exist; not tried).
- **The complexity budget:** the effect text is 31 words, the Action's two Versions are the Archer's. A Feature is "one sentence each": this is two short ones.

**If you'd rather the mark did something else** (one of these in the place of the smaller hit):
- **(B) It pays for ignoring him:** "The first time each round it damages an ally within 5 squares of you, it takes [R] 2 Ho" (your Power Modifier). 4e's Divine Challenge. About 3 a turn: certain damage is cheap, and the launch 4e Paladin's was called "barely a deterrent".
- **(C) A soft taunt:** "It is Taunted by you" (1 Bane against anyone else). About 2 to 5 a turn [SIM: Taunted 1 to 3 a hit]; the kind that was ignored on the Guardian.

**Not in this card, on purpose:** the burst (a later decision: a Strike that is better against the creature he Judged), and anything that stops it walking past him (a Reaction or an Art).

**Lucas's answer (2026-11-14): "the Action looks good", with three changes.**
1. **No "You gain the X Action" wrapper Feature: the class grants the Action itself.** (Claude agreed: 4e prints Divine Challenge as a power labelled "Paladin Feature"; our Archer's level list already reads "the Mark Quarry Action"; Draw Steel does use a wrapper sentence, and it adds nothing a title bar doesn't.) The card's title bar says "Paladin Feature".
2. **Added: "A creature stops being Judged when it goes Down"** (the 0 AP / 0R Version would otherwise leave several creatures Judged).
3. **The Flavor read "like AI text": it should describe the Action**, as Draw Steel and 4e do. Their lines, read from the rules: Draw Steel's Judgment: "You utter a prayer that outlines your foe in holy energy."; My Life for Yours: "You channel some of your vitality into more resilience for you or an ally."; 4e's Divine Challenge: "You boldly confront a nearby enemy, searing it with divine light if it ignores your challenge."; Holy Smite: "Your weapon fills with divine radiant energy, which bursts forth as you strike your enemy." **The rule from now on:** one sentence, "You..." or "Your...", present tense: what the character does, what is seen, and a hint of the effect. No epigram, no metaphor standing alone.

**Also asked (Lucas): can later Features expand an Action** ("at Stage 1, Judged creatures take a penalty to Speed")? **Yes, as a pattern** (the Pathfinder 2e Champion's reaction grows this way instead of multiplying: research). The bookkeeping stays light under three limits: the added clause is written into the Action's own text (one card to read, not a card and a note); at most one added clause a Stage; and it prefers a standing effect on the one Judged creature or the trigger the card already watches, never a new trigger. A Speed penalty on the Judged creature is the light kind (one creature, always on, Foundry can hold it as an effect).

**The final card:**

> **Judge** · Paladin Feature · Turn · [Divine] · Distance 10 sq. · Target: one enemy you can see
> *You pronounce a foe guilty before your god, and holy light dulls its blows against those who stand near you.*
> **0 AP:** At the start of an encounter, or as a 0R when the creature you Judged goes Down: the target is **Judged** by you until the encounter ends.
> **1 AP:** The target is Judged by you instead of the one you had.
> A creature stops being Judged when it goes Down. A creature Judged by you counts as Profane for you. The first time each round it damages an ally within 5 squares of you, that damage is reduced by your Power Modifier.

## Decision 3: the burst, Smite (DECIDED, Lucas, 2026-11-14: A, with exploding dice and at most 4; the final card is at the end of this section)

Lucas (2026-11-14): "Propose. And it should be Smite." So Smite stops being the every-round Hallmark and becomes the explosion. Drafted two ways, as the charter's question 9 asks: **A**, a Feature every Paladin has at level 1 (recommended); **B**, the Encounter Pick moved to level 1.

**Research first.** A burst players accept is one Action, built in the open, capped: 13th Age's designer sets a once-a-battle attack at 1.5 times a normal one and a daily at 2 times. Its worst result still does about half its best (Draw Steel's tiers; 13th Age's smite deals half on a miss). A slow build has a price in short fights (the Censor's round 1: "Not enough to do anything powerful"), so the build should be a choice, not a gate. The cost that suits a front-liner is being exposed for a round, not being empty afterwards. And it should not be the right answer every round (Crawford on why 5e's smite changed: "not be in the position of the right choice is always just to Divine Smite").

### A. Smite as a Feature (recommended)

> **Smite** · Paladin Feature · Encounter · 2 AP · [Divine, Signature, Strike, Weapon] · Distance: Weapon · Target: one creature
> *Holy light gathers on your weapon as the fight wears on, and you bring all of it down in one blow.*
> **Smite dice:** [R] 1d6 Ho for each Escalation you have (1d8s against a Profane creature).
> **Tier 1:** your Smite dice. **Tier 2:** [V] 1[W] + [Mod] + your Smite dice. **Tier 3:** [V] 1[W] + [Mod] + your Smite dice.
> When you use Smite, you can spend your Reaction AP: roll 2 more Smite dice.

```
With a Greatsword, Signature +2 against Defense 13 (Tier 1 28%, Tier 2 51%, Tier 3 21%); a Weapon Attack at +1 averages 7.3 = 25 points.

Against the creature he Judged (d8s)        Tier 1 / 2 / 3     average   points   [all: judgment, computed from the dice; not a SIM run]
Escalation 1 (round 1, no Momentum) ....... 4.5 / 16 / 20        13        46
Escalation 3 (round 3, or round 1 with Momentum 2)  13.5 / 25 / 29   22     76
Escalation 4 .............................. 18 / 29 / 33        27        92
Escalation 6 .............................. 27 / 38 / 42        36       122
... with the Reaction AP (2 more dice) .... + 9                          + 31
Against a creature that isn't Profane (d6s): 1 less a die (Escalation 3: 66 points; 4: 78)

What the 2 AP would have been: two Weapon Attacks ....... 47   [judgment: 25, and 22 with the At-will Bane]
The Reaction AP he gave up ............................... 10 to 15   [the anchor for a 1R Reaction a turn]
--- Used in round 3 on the Judged creature: 76 to 92 for 2 AP (1.5 to 1.9 times), 107 to 123 with the Reaction AP.
    Over a fight of 3.5 rounds it adds about 9 to 13 a turn (about 15 with the Reaction AP), of a Feature's 10 to 15: on.
```

**Analysis.**
- **The decision it gives: when.** In round 1 it is two Weapon Attacks' worth: nothing forbids it, nothing rewards it. Every round it grows by a die, and the table sees it grow (the Escalation counter is the Smite). Wait too long and the target is dead or the fight is over. With Momentum 2 it is already a real Smite in round 1: "explode before they see it coming" belongs to the party that kept going.
- **"When they use all they have":** the Reaction AP. He can add 2 dice and then, until his next turn, he can't protect anyone. That is the brief's sentence as a cost, and it needs no counter (your answer to question 6).
- **Not a consistent damage dealer:** once an encounter. Every other turn his Strike is a Weapon Attack at +1.
- **It lands.** On a Tier 1 the blade misses and the light doesn't: the Smite dice alone, about half of a Tier 3. The roll decides how big, not whether.
- **Divine against the Profane, in every campaign:** d8s against a Profane creature, and the creature he Judged is one. So the natural target is the one he named in round 1, and a real undead he hasn't judged gets it too.
- **The rules it touches:** it reads Escalation and spends nothing of it. It spends the Reaction AP on his own Action: an exception to Chapter 2 ("the Reaction AP pays only for Reactions") that the card states. The level 2 hook (an ally within 5 becomes Bloodied or goes Down: +1 Escalation) now feeds the Smite: when his protection fails, his blow gets bigger.
- **Its siblings:** today's Smite (Round, 1 / 2 / 3 AP, 133 words) and Holy Wrath (Encounter, 50 points: no nova) are both replaced by this. The Bright light and the Bane on Hide leave Smite; light is for an Art.
- **The size:** in the band the research gives (1.5 to 2 times) when used at Escalation 3 or 4. At Escalation 6 with the Reaction AP it is 8 dice (about 45 damage on average, a third of an Elite): rare (round 6, or round 4 with Momentum 2), and that is the "explode". If it proves too much: "at most 6 Smite dice".
- **Complexity:** one Version, 44 words, two riders (the Profane die, the Reaction AP), one conditional. Inside an Encounter Action's budget.
- **Table feel:** a handful of dice that everyone watched grow, on the enemy he named in round 1. The risk: a player who always waits for one more die and ends the fight with the Smite unused (the hoarding the research describes); it resets every encounter, so the lesson is cheap.
- **Foundry:** a damage formula that counts Escalation is not a setting I have seen on a card; not checked.

### B. Smite as the Encounter Pick, taken at level 1

The same card with bigger dice (1d8 for each Escalation, 1d10s against a Profane creature: about 90 to 105 points at Escalation 3 or 4), offered beside two other Encounter Actions.
- **For it:** it follows the level list as written (an Encounter Pick is the place for an Encounter Action); the explosion is a bigger one.
- **Against it:** a Paladin can then pick something else and have no burst at all, which is your brief's third word gone, and question 7 said the defining pieces are for every Paladin. It also moves the level 2 pick to level 1 (level 2 becomes the hook and a Passive only), and at about +20 to 25 a turn it overshoots level 1's 130 unless the Hallmark Action shrinks.
- **My recommendation: A.** Every Paladin smites; the Encounter Pick at level 2 stays a real choice among three other moments.

**Lucas's answer (2026-11-14):** A (a Feature every Paladin has). The Reaction AP for 2 more dice: yes. Tier 1 as the dice alone: yes. **And two changes he proposed: the Smite dice explode, and at most 4 of them.** Claude agreed with both: exploding dice are already the weapon dice's rule (1d6!), they are what "explode" should look like on the table, and each die is worth about a sixth more; the cap takes that back at the top and brings the full Smite to round 4 (round 2 with Momentum 2), so there is less reason to hoard it. **One point Claude set and Lucas can revert:** the Reaction AP's 2 dice are on top of the 4 (6 at most).

**Then (Lucas, the same day): the Reaction AP gives 1 more die, not 2, and it can go over the 4; "this needs to be written clearly"; "if only 1 would not be worth it, keep at 2".** Claude's answer: 1 is worth it, and it is the better card. One d8! is about 5 damage (17 points); the Reaction AP he gives up is worth 10 to 15 a turn; and 5 damage dealt is about what 1 Health saved is worth. So 1 die is an even trade: right when it finishes the target or when no ally is in danger, wrong otherwise. With 2 dice it was nearly always right, which is a tax, not a choice.

**The final card:**

> **Smite** · Paladin Feature · Encounter · 2 AP · [Divine, Signature, Strike, Weapon] · Distance: Weapon · Target: one creature
> *Holy light gathers on your weapon as the fight wears on, and you bring all of it down in one blow.*
> **Smite dice:** [R] 1d6! Ho for each Escalation you have, up to 4 dice. Against a Profane creature they are 1d8!s.
> **Tier 1:** your Smite dice. **Tier 2:** [V] 1[W] + [Mod] + your Smite dice. **Tier 3:** [V] 1[W] + [Mod] + your Smite dice.
> When you use Smite, you can spend your Reaction AP to roll 1 more Smite die. This die is on top of the 4: 5 dice at most.

```
Greatsword, Signature +2 against Defense 13; on the creature he Judged (1d8!s, 5.1 a die)   [judgment, computed from the dice]
Escalation 1 ....... Tier 1 / 2 / 3:  5 / 16 / 20    average 14    48 points
Escalation 3 ....... 15 / 27 / 31                    average 24    83 points
Escalation 4 or more (4 dice) ... 21 / 32 / 36       average 30   100 points
... with the Reaction AP (5 dice) ... 26 / 37 / 41   average 35   118 points
Against a creature that isn't Profane (1d6!s): 73 at Escalation 3, 88 at 4 or more
--- At full size it is exactly an Encounter Action's price (2 AP: 100).
```

**For the book when applied:** Chapter 2 gets the exception in the card's own words (the Reaction AP spent on Smite); the old Smite (Round, 1 / 2 / 3 AP) and Holy Wrath leave; the Paladin's Hallmark Action choice no longer holds Smite.

## A rule for the Paladin's Strikes (DECIDED with Lucas, 2026-11-14): his Hallmark Strike costs 2 AP

Lucas: "I think the paladins Hallmark 'strike' actions should be 2 AP by default, so it doesnt become a Striker." Claude agreed, with two conditions.
- **What 2 AP does:** his turn becomes one main Strike, one small thing and a move (2 + 1 + 1), the shape of Draw Steel's turn (a main action, a maneuver, a move) and 4e's. He rolls fewer attacks than the Archer, and Smite (2 AP) takes the same slot on the turn he explodes.
- **What 2 AP doesn't do by itself:** lower his damage. In our measurements a 2 AP Action priced at 50 with a Weapon Attack is worth 107 against three Weapon Attacks' 100 (no At-will Bane on it). So **condition 1: the Strike's damage is about 35 of its 50 points, and the rest is its rider** (the shield).
- **Condition 2: its Tier 1 still does its rider.** With Weapon +1 one roll carries half his turn; Pathfinder 2e's two-action Power Attack is called "a trap" on Paizo's forums because it is one roll priced under two Strikes. A Paladin whose Strike misses still shielded someone.
- He keeps the Weapon Attack (1 AP) like everyone, and the At-will Bane already discourages chaining it.

## The Hallmarks' names (Lucas, 2026-11-14)

The two Hallmark Actions are a Strike and a Help. Lucas: "Help can be Lay on Hands, or shield of faith?" Claude's answer: **Lay On Hands** for the Help (the touch, on his own turn: Guard before the hit; its second use can be the class's one card that lets an ally use a Rally Point). **Shield of Faith** stays a Hallmark Reaction's name (the smaller hit, on the enemy's turn).

## The Hallmark Strike's rider: the choices (asked by Lucas, 2026-11-14; from the rules and the research, no new search)

The Strike has about 15 of its 50 points for one rider, and the rider must still happen on a Tier 1. Prices: Guard 6 a point, 8 on an ally about to be hit [SIM, the guide]; conditions from the PC budget's rider table (melee seat, against Standards; an Elite in brackets) [SIM]; forced movement at Lucas's rates.

| Rider | Price | What it does for the brief | Watch |
|---|---|---|---|
| **Guard to an ally** near the target (Power Modifier + 1 = 3) | 18 to 24 | "Guard before the hit", his chosen support; two things in one Action | the default |
| **A weaker next hit:** the target takes 1 Bane on its [Strike] Actions (EoT) | about 5 to 8 | a smaller hit for everyone, himself included; 4e's Enfeebling Strike; old Divine Power's effect | small; a Bane is about 9% of a roll |
| **Guard to himself** (4e's Bolstering Strike) | 12 to 18 | he stays up in front | aids nobody else |
| **Slid 1 or Pushed 1** | 3 to 5 | peels the enemy off an ally; Collision next to a wall | needs somewhere to send it (research: forced movement needs a payoff) |
| **Hindered (EoT)** (Speed halved) | 0 to 3 | the line: it can't reach the back this turn | worth nothing if it is already where it wants to be |
| **Frightened of you (EoT)** | 2 to 4 (6) | a Bane on all its rolls, and squares toward him cost double: the profane flinch | every round with no Save was judged too strong on the Archer's Harrying Shots (Lucas, 2026-11-04) |
| **Taunted by you (1 round)** | 1 to 3 | a soft "fight me" | the kind that was ignored on the Guardian; weak alone |
| **Vulnerable 1 (EoT)** | 2 to 4 | allies hit it more easily: support through the party's attack | pulls him toward a leader, away from a protector |
| **Prone / Slowed 1 / Dazed 1** | 7 to 9 / 7 to 10 / 11 to 15 (20) | takes the enemy's AP: the strongest protection of all | a controller's tools; over budget every round; Tier 3 only, or an Encounter Action |
| **Bright light on the target** (it can't Hide) | 0 to 5 | divine identity | kept for an Art |
| **More against the creature he Judged** (4e's Holy Strike) | by the bonus | ties the Strike to the mark | a conditional on an every-round card (the budget allows none) |

**Claude's reading:** Guard to an ally first. The two real alternatives are the weaker next hit (the same direction, protects without choosing whom, cheap enough to sit beside something else) and Slid 1 (the only one that changes the board). The AP-takers belong on an Encounter Action. One of the others can be the Strike's Tier 3 line.

**Immobilized as the rider (asked by Lucas, 2026-11-14; from the rules and our numbers, no new search).** The rule (Chapter 8): the creature can't use Move Actions or Evade; it ends by spending 1 AP [Move] (Break Free) unless the card says otherwise; and it is hard to move (a Forced Movement that doesn't roll is disrupted). Two forms on cards: "(EoT)" and plain ("until it escapes"). **Prices [SIM, `pc-budget.md` sections 3 and 9]:** on a melee PC's attacks, Immobilized (EoT) -3.6 against Standards and -3.5 against an Elite; until it escapes -0.1 and +1.5; on maps -1.0 to -2.1; from the ranged seat +3.4 and +1.8. Negative because the white room's enemy, pinned next to him, spends every AP hitting him and nothing counts the back line it didn't reach: this is one of the SIM's blind spots, not a verdict. On a PC it is Moderate (8) in the Bestiary's table. **History:** the Archer's Pinned Down (Immobilized (EoT) on a shot every round) was cut as too strong (2026-11-04); Pinning Shot has it once an encounter. **Research:** "leaving costs the action economy" is the second strongest way to make a front line real (Lancer's Full-action Disengage, 13th Age's disengage check); Draw Steel's Judgment buys "its speed becomes 0" for 1 wrath. **Claude's reading:** it is the best answer we have to "they stay in front so the squishies can stay back", in the plain form (the enemy pays 1 AP to leave him: a Standard's AP is 25 points, on the turns it wanted to leave), on a Tier 2 or 3 only, with a lesser Tier 1 (Hindered (EoT)). Its limits: nothing against an enemy already next to the ally it wants, or one with Reach or a ranged attack; it blocks the party's own pushes on that enemy. **And an argument for it over Guard on the Strike:** the other Hallmark Action, Lay On Hands, already gives Guard; a Strike that pins makes the two Hallmark Actions two styles (the one who shields, the one who holds the line) and not one style twice.

## Decision 4: the Hallmark Strike (PROPOSED, waiting for Lucas)

Lucas (2026-11-14): yes to the Strike with Immobilized. **Why Claude hadn't listed Immobilized among the riders (his question):** the list was filtered three ways without saying so. It was built from the PC budget's rider table, where Immobilized is negative for a melee PC, and that number was treated as a verdict (it is a blind spot: the white room doesn't count the back line). It was filtered by his last direction (a smaller hit, Guard), not by all five lines of the brief. And holding the line had already been parked on "a Reaction or an Art", so it wasn't looked for on the Strike. The fix proposed to him: when he asks for choices, the whole list from the rules is shown, the rejected ones with their reason.

**Research first.** A two-AP attack is a trap when it is one roll priced under two (Pathfinder 2e's Power Attack). A front line is made real by making leaving cost the action economy (Lancer, 13th Age), and Draw Steel's Censor has exactly this on his at-will strikes ("Halt Miscreant!": slowed). Automatic control every round was cut from the Archer (Pinned Down).

> **Halting Strike** · Paladin Hallmark Action · Round · 2 AP · [Divine, Strike, Weapon] · Distance: Weapon · Target: one creature
> *Your blow lands wreathed in light that roots your foe where it stands.*
> **Tier 1:** [R] 1d6 Ho. **Tier 2:** [V] 1[W] + [Mod] + [R] 1d6 Ho. **Tier 3:** [V] 1[W] + [Mod] + [R] 1d6 Ho.
> Tier 2 or 3: the target is Immobilized for 1 round.

```
Greatsword, Weapon +1 against Defense 13 (Tier 1 35%, Tier 2 48%, Tier 3 17%); a Weapon Attack averages 7.3 = 25 points.
Damage: 3.5 / 13.7 / 17.6, average 10.8 ............................. 37   [judgment, computed from the dice]
Immobilized for 1 round, on 65% of uses:
  the enemy pays 1 AP to leave him (a Standard's AP), on the turns it wanted to (about a third)  about 5   [judgment: Dazed 1, an AP taken for certain, is 11 to 15 a landing (SIM)]
  the back line it didn't reach that turn ............................ not priced (the SIM's blind spot: it measured -3.6 to 0 in a white room; suggested 5 to 10 on a map with a back line)
--- Total: about 42, and 47 to 52 where there is a back line to protect, of 50: on
```

**Analysis.**
- **The decision it gives:** whom to pin. The enemy heading for the Archer, or the one he Judged (pinned next to him, it can only hit him or an ally in its Reach, and Judge makes that hit smaller).
- **The enemy's choice:** stay and hit the Paladin (AD 14), or pay 1 AP to Break Free and then move. With the Advance in one piece it pays before it can go anywhere, and it can't Evade or Charge either.
- **Not a striker:** one roll at Weapon +1 for 37 points of damage where two Weapon Attacks would be 47. He gives up a quarter of his damage to hold something in place.
- **Its Tier 1 isn't empty:** the light lands (1d6), as on Smite. No condition on a Tier 1: an automatic pin every round is what was cut from the Archer.
- **Two styles now:** Halting Strike holds the line; Lay On Hands shields.
- **The rules it touches:** nothing new. "Immobilized for 1 round" can still be ended with Break Free (1 AP), as Chapter 8 says. The Immobilized DC is 11 + his Weapon Modifier (12). An Immobilized creature resists Forced Movement: the party's own pushes on it can fail.
- **Its siblings:** the Archer's Pinning Shot (Encounter, 1 AP, Immobilized (EoT) at range) and Lock & Loose. The Paladin's is every round, but in melee, for 2 AP, on two thirds of his rolls.
- **Its limits:** nothing against an enemy already next to the ally it wants, or one with Reach or a ranged attack.
- **Complexity:** one Version, 9 words of effect, one condition, no conditional.
- **Table feel:** "it's rooted" is a thing everyone at the table sees on the map. The risk: a GM whose monsters never wanted to move makes it read as a plain, weak attack.

**For Lucas to choose:** the name (Halting Strike is a placeholder); "for 1 round" or "(EoT)"; whether it should roll [Signature] (+2) instead of Weapon (+1): Claude kept +1 so that only Smite hits like a striker.

**Lucas's answer:**
