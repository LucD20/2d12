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

## Decision 4: the Hallmark Strike, Binding Light (DECIDED, Lucas, 2026-11-14; the final card is at the end of this section)

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

**Lucas's notes (2026-11-14), applied:** (1) **each Tier's line holds its whole result**, the condition after a semicolon, as Draw Steel writes it (Claude agreed: one line to read after the roll; the Effects row stays for what happens whatever the Tier; a rule of the charter now). (2) **A Tier 3 should deal a bit more** ("1d6!, or 1d8"): the Holy die is 1d8 on a Tier 3. Claude's note: a Greatsword's own Tier 3 is already bigger (8 + 1d8! against 5 + 1d6!), but both lines read "1[W]", so the card must show it.

> **Halting Strike** · Paladin Hallmark Action · Round · 2 AP · [Divine, Strike, Weapon] · Distance: Weapon · Target: one creature
> *Your blow lands wreathed in light that roots your foe where it stands.*
> **Tier 1:** [R] 1d6 Ho
> **Tier 2:** [V] 1[W] + [Mod] + [R] 1d6 Ho; Immobilized (1 round)
> **Tier 3:** [V] 1[W] + [Mod] + [R] 1d8 Ho; Immobilized (1 round)

Damage 3.5 / 13.7 / 18.6: 38 points [judgment, computed]; with the pin, 43 to 53 of 50.

**Open from the same rule, for Lucas:** Smite's Tier 2 and Tier 3 also read the same ("[V] 1[W] + [Mod] + your Smite dice"). A fix in one clause: "Tier 3: ... + your Smite dice, and 1 more" (about +4 points: 104 at 4 dice).

**Lucas's answer (2026-11-14):** the card is good; the Weapon Modifier (+1) is good; the name "is ok, though if you have something more 'divine' it would fit best". **Claude's pick: Binding Light** (others offered: Fetters of Faith, Stand Condemned). On Smite's Tier 3: "Either do a 2*[MOD] or 1 more smite dice, which ever the research points for the best": **1 more Smite die.** The research: in Draw Steel a tier 2 is about 70% of a tier 3 on damage; Smite's was 89% (32 against 36 at 4 dice); one more die makes it 78%, twice the Modifier only 84%. And what players name when they praise a smite is the pile of dice, not a flat number. Cost: about +4 points (104 at 4 dice).

**The final cards:**

> **Binding Light** · Paladin Hallmark Action · Round · 2 AP · [Divine, Strike, Weapon] · Distance: Weapon · Target: one creature
> *Your blow lands wreathed in light that roots your foe where it stands.*
> **Tier 1:** [R] 1d6 Ho
> **Tier 2:** [V] 1[W] + [Mod] + [R] 1d6 Ho; Immobilized (1 round)
> **Tier 3:** [V] 1[W] + [Mod] + [R] 1d8 Ho; Immobilized (1 round)

> **Smite** (Tier 3 revised) · Paladin Feature · Encounter · 2 AP · [Divine, Signature, Strike, Weapon] · Distance: Weapon · Target: one creature
> *Holy light gathers on your weapon as the fight wears on, and you bring all of it down in one blow.*
> **Smite dice:** [R] 1d6! Ho for each Escalation you have, up to 4 dice. Against a Profane creature they are 1d8!s.
> **Tier 1:** your Smite dice
> **Tier 2:** [V] 1[W] + [Mod] + your Smite dice
> **Tier 3:** [V] 1[W] + [Mod] + your Smite dice + 1 more Smite die
> When you use Smite, you can spend your Reaction AP to roll 1 more Smite die. Neither extra die counts toward the 4.

Smite at 4 dice on the creature he Judged: 21 / 32 / 41, average 31: 104 points; with the Reaction AP 122 [judgment, computed].

## Decision 5: the Help Hallmark, Lay On Hands (PROPOSED; revised after Lucas's notes, the card at the end of this section)

**Research and rules first.** Guard doesn't stack (the higher value), it ends with the encounter, and reduced damage comes before it (Chapter 4): so Guard is given before the hit and can't snowball. Temporary hit points are rated at about two thirds of healing, more on the ally about to be hit. A secondary healer is for the emergency and must not cost his whole turn. In Draw Steel a dying hero can't recover alone: someone else's action is the way back up; in our rules a Down creature can't use Steel Yourself, but another's Action can let it use a Rally Point. Lucas: Rally Points for allies are "more of a cleric thing", some but not much.

> **Lay On Hands** · Paladin Hallmark Action · Round · [Divine, Focus] · Distance: Reach · Target: another willing creature
> *You lay a hand on an ally, and a skin of pale light settles over them.*
> **1 AP:** The target gains Guard equal to 2 + your Power Modifier.
> **2 AP:** The target gains that Guard and can use 1 Rally Point.

```
1 AP: Guard 4 ............................ 24   [SIM: 6 a point of Guard]   up to 32 on the ally about to be hit [the forums' two thirds of healing]
      less the Guard nobody hits .......... about a third unused [judgment] → 17 to 22 a use
--- 1 AP: 17 to 24 of 25: on, a little under

2 AP: Guard 4 ............................ 24   [SIM]
      1 Rally Point, the ally's own ...... 5 [Lucas's rate]; -11 as an every-round habit [SIM: the ally would have spent it anyway]
      on a Down ally: back up, with Guard . not priced (the emergency: a Down ally can't use Steel Yourself; this is the party's only other way)
--- 2 AP: about 29 on paper of 50: under, except on the turn someone is Down, when nothing else does it
```

**Analysis.**
- **The decision it gives:** who is about to be hit. Guard 4 is a Standard's whole Basic attack (3.5 on a Tier 2). It doesn't stack and it stays until something hits it, so shielding the same ally every round is wasted: he moves it around.
- **It is your support direction:** Guard before the hit. With Judge (the Judged creature's first hit a round is 2 smaller) an ally can shrug off that hit entirely.
- **The 2 AP use is the class's one Rally Point card.** It costs him what Steel Yourself costs the ally (2 AP), spends the ally's own Rally Point, and once a round. What it adds is reach: it works on a Down ally. That is "make sure you don't go down" as an emergency, not a healing engine.
- **Touch, and "another" creature:** he must stand next to whom he protects (the brief), and he can't shield himself with it (his own Guard comes from unused AP).
- **Two styles:** the Binding Light Paladin spends 2 AP holding an enemy; the Lay On Hands Paladin spends 1 AP shielding an ally and still has 3 AP to fight.
- **Rules it touches:** none new. [Focus] is today's trait on it.
- **Siblings:** today's Lay On Hands (a Rally Point at 1, 2 and 3 AP) and Lucas's first draft (a Rally Point, Guard and an Evade in each of three sizes) are both replaced.
- **Complexity:** two Versions that are two uses, 21 words, no condition, no conditional.
- **Table feel:** quick; a number goes on the ally's token. The risk: Guard that is never hit feels like a wasted AP.

**For Lucas to choose:** Guard 2 + Power Modifier (4), or a die (1d6 + Power Modifier); whether the 2 AP use stays, given "not too much" Rally; Reach, or 5 squares.

**Lucas's notes (2026-11-14), applied:**
1. **Flat Guard.** "It might need to increase by Stages. Lets not do that yet but keep in the notes" (noted in the rules backlog for the Stages work).
2. **The 2 AP use stays**, written in full: "The target gains Guard equal to 2 + your Power Modifier and can use 1 Rally Point."
3. **Not touch only:** 5 squares, with a **Setup** that brings him to the ally ("Setup is underused so I feel it could fit here"). Claude agreed and wrote it on Charge's wording (a straight line, stop where the target is within Reach), so the book has one way to say it.
4. **"A willing creature other than yourself" is long: is a general rule needed?** It exists already (found in the Glossary): **"Ally: A creature on your side. You are never your own ally."** So the Target line is "One willing ally".

**From the rules and the research (no new search):** a move bundled into an Action is strong because it saves the move's AP (Pathfinder 2e's Sudden Charge; our note on "Setup: Advance 3": about 10, on the turns he had to move). With the Advance in one piece it is also a second movement in a turn. It is an Advance, so Reactions that answer movement can fire on it (an Evade wouldn't), and by the Advance rule no Interact fits inside a Setup's Advance. The Setup makes it a Compression as well as a Help ("the touch as you pass" was the charter's own example).

> **Lay On Hands** · Paladin Hallmark Action · Round · [Divine, Focus, Move] · Distance: 5 sq. · Target: One willing ally
> *You stride to an ally's side and lay a hand on them, and a skin of pale light settles over them.*
> **Setup:** You Advance in a straight line toward the target and stop on the first square from which it is within your Reach.
> **1 AP:** The target gains Guard equal to 2 + your Power Modifier.
> **2 AP:** The target gains Guard equal to 2 + your Power Modifier and can use 1 Rally Point.

```
1 AP: Guard 4 ................................ 17 to 24   [SIM: 6 a point; about a third never hit: judgment]
      Setup: an Advance of up to 5 toward the ally  about 6   [not priced: an AP saved is 12 to 25, on about half his turns; suggested 5 to 10]
--- 1 AP: 23 to 30 of 25: on
2 AP: the same, and 1 Rally Point (the ally's) . 5 [Lucas's rate]; on a Down ally: not priced (the emergency)
--- 2 AP: about 35 of 50 on paper: under, except when someone is Down
```

**What the Setup changes.**
- **He goes where the hit is coming.** After it he stands next to the ally he shielded: the Paladin's body ends up between, which is the brief, and his Speed +0 stops mattering for this.
- **It can also pull him off a line he was holding**, and it is a real Advance: an enemy's movement Reaction can answer it. That is a decision, not a flaw.
- **It needs the [Move] trait** (as Charge has): Immobilized or Prone, he can't use it. For Lucas: allow it without the Setup on an ally already within Reach? (Claude's default: yes, a Setup that moves 0 squares is still legal, as when he is already adjacent.)
- **A straight line** means a wall or a creature in the way stops it (Charge's rule: an unwilling creature's space is Difficult Terrain, and the movement ends in the last legal square). If he ends without the ally in Reach, the Action has no effect: the same as a Charge that falls short.

**Lucas's two questions on the Setup (2026-11-14), answered from the rules:**
1. **"Isn't 'and stop on the first square from which it is within your Reach' already in the straight line rules?"** No: Chapter 3's Straight Line rule gives the path (the squares the line crosses) and the stop when a square isn't legal ("the movement stops in the last legal square before it"). Where the movement ends is the Action's to say; that clause is Charge's own. But the rule draws the line "to the center of the destination square", so naming the destination is enough, and shorter: "to a square from which the target is within your Reach". It is also better: he picks the square, so he can end between the ally and the enemy.
2. **"Setup is optional unless it says 'Must'."** The Setup rule itself is one sentence and doesn't say so. What the rules have: "Up to" (Chapter 1: a number you can move is a maximum, "you can use fewer, or none, unless the rule says you **must**") and Linked Actions (Chapter 2: optional when the Action says you **can**, required when it says you **do** it; a required one you can't make disrupts the whole Action). So "You Advance..." would read as required, and an Immobilized Paladin's Lay On Hands would be disrupted. **The card now says "You can Advance"**, which is optional under today's rules. **Proposed for Chapter 2's Setup, when the classes are applied:** "A Setup is optional unless it says you must."
3. **Distance:** Reach. The Talent Cut Through is the precedent (Distance: Weapon, after a Setup that moves him): the Distance is measured after the Setup.

**Then (Lucas, the same day), three more points, all taken:**
- **A clear move with a clear end point: closer, never around.** He doesn't want Pathfinder 2e's Sudden Charge habit (running around a creature to flank on the way). Claude's "to a square from which the target is within your Reach" let the Paladin pick the square, which is moving around: withdrawn. **The Straight Line rule doesn't say what "toward a creature" means** (it draws the line "to the center of the destination square" and leaves the destination to the Action), so it gets a sentence: the line goes to the center of the target's space, you move along it and can stop in any square on it, and you can't enter the target's space. With Reach 1 you end in the one square before it; with more Reach you may stop earlier or go on. The card then needs no stop clause.
- **"Can" is the default for a Setup, "must" the addition:** since the rule is logged, the card doesn't write "can".
- **The Distance measured after the Setup** goes into the Targets and Setup entries.

**The final card:**

> **Lay On Hands** · Paladin Hallmark Action · Round · [Divine, Focus] · Distance: Reach · Target: One willing ally
> *You stride to an ally's side and lay a hand on them, and a skin of pale light settles over them.*
> **Setup:** You Advance up to 5 squares in a straight line toward the target.
> **1 AP:** The target gains Guard equal to 2 + your Power Modifier.
> **2 AP:** The target gains Guard equal to 2 + your Power Modifier and can use 1 Rally Point.

**Three rules for the book, with this card (logged in the rules backlog; not applied):**
1. **Chapter 2, Setup:** "A Setup is optional unless it says you must."
2. **Chapter 2, Setup and Targets:** "You name the Action's targets before its Setup. Its Distance is measured after the Setup: a target that isn't within the Distance then is not affected (the cost is still paid)."
3. **Chapter 3, Straight Line:** "**Toward a creature.** When you move in a straight line toward a creature, the line goes to the center of its space. You can stop in any square on the line, and you can't enter the creature's space: you end, at the latest, in the last square before it."

**Status: DECIDED (Lucas, 2026-11-14).**

## Decision 6: the first Hallmark Reaction, Shield of Faith (DECIDED as proposed, Lucas, 2026-11-14)

**Research and rules first.** The best-liked protector's reaction is one trigger, one payload, one rider (the Pathfinder 2e Champion's four protecting causes), and it shaves the hit, never erases it (Draw Steel's final design reduces damage, "never eliminated"). The 4e Swordmage, with little damage of his own, was obeyed because the number was heard ("preventing 8 damage from my marked target is enough to draw them to me"). A soft taunt alone was ignored on the Guardian; behind a real reduction it is the second half of the trap. Ours today: Shield of Faith reduces by 2d6 + [Mod], on him too, fires in 82% of rounds and is worth 66 points a turn; Lucas's target is about 15, and a Reaction should fire in about half the rounds. A Reaction "you or an ally" gets spent on himself: allies only (the Glossary's "ally" already excludes him).

> **Shield of Faith** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You raise a hand, and a pane of light turns part of the blow aside and pulls your foe's eye to you.*
> **Interrupt:** An enemy's [Strike] Action would damage an ally within 5 squares of you.
> That damage is reduced by 1 + your Power Modifier, and the enemy is Taunted by you (1 round).

```
Damage reduced by 3 ........................... 36 each time   [SIM: 1 Health = 12]
Taunted by you (1 round) ...................... 1 to 3 each time   [SIM: the rider table]
x it fires in about half the rounds ........... [judgment: Rebuke's same trigger fired in 66% of rounds; allies only and one Reaction AP: about 50%]
--- Total: about 19 to 20 a turn, of 10 to 15: a little over
    With "reduced by your Power Modifier" (2): about 13 to 14: on
```

**Analysis.**
- **The decision it gives:** which hit. He has one Reaction AP a round; a second Shield needs an AP he kept from his turn (and an AP he keeps and doesn't use becomes Guard 2 for himself). So "do I hold an AP back" is his real choice every turn.
- **The enemy's choice after it:** Taunted, its Actions against anyone but him take a Bane for a round. Hit the Paladin (AD 14), or hit his ally worse.
- **With Judge:** on the creature he Judged, its first hit a round on an ally is 2 smaller, and the Shield takes 3 more: a Standard's Basic attack (3.5) is gone, its Special (4 + 1d6) is cut by two thirds.
- **With Smite:** if he spent his Reaction AP on Smite, there is no Shield that round. That is Smite's cost.
- **It shaves, it doesn't erase**, except for small hits; it has a number the table hears; it needs no roll.
- **Rules it touches:** none new. "Would damage ... before the damage" is a defined moment; Taunted is Chapter 8's.
- **Siblings:** today's Shield of Faith (2d6 + [Mod]); Lucas's draft of 2026-11-14 (the enemy chooses: half damage, or Taunted and the Paladin Empowered): this is that draft's two halves made into one certain effect, so the GM never picks the cheap one.
- **Complexity:** one Version, 19 words, one condition, no conditional.
- **Table feel:** "minus 3, and it's Taunted" on the GM's turn: quick, and it changes what the monster does next.

**For Lucas to choose:** 1 + Power Modifier (3, about 20 a turn) or the Power Modifier (2, about 14); "an enemy's [Strike] Action" (not areas or Saves) or any damage; Taunted as the rider, or none.

**Lucas's answer (2026-11-14):** the size (1 + Power Modifier) "is good as is"; a Strike only: good; Taunted is a good rider. **His question: in other media Shield of Faith grants Defense; will the Paladin have a flat Defense Action, so this one should take another name?** Claude's answer, from our notes: probably not as a core card. A flat Defense bonus is the kind of protection nobody sees (the 5e aura: "Forgetting to use the paladin's aura when it comes up"; our own rule now: no silent bonuses), and the SIM prices +1 Defense on an ally for a round at 12 points for an AP, half an AP's worth. If one comes, it will be an Encounter Action or an Art (today's Beacon is that card) and takes its own name. A pane of light that turns part of a blow aside is a shield: **the name stays.**

## Decision 7: the second Hallmark Reaction, Rebuke (DECIDED, Lucas, 2026-11-15: "Its good how it currently is"; the card at the end of this section)

**Research and rules first.** The strongest way to make a front line real is that movement ends near the front-liner (Lancer: a character that becomes Engaged stops and loses its unused movement; 13th Age: an unengaged defender can intercept one enemy moving past). The opportunity attack is the weakest, and worthless on a low-damage character (RPGBot: "the absolute floor of stickiness"). Our rules have the pieces: "an enemy moves closer to you or to an ally" is a defined moment (Chapter 2; the Archer's Overwatch uses it); a Trigger on a Move Action fires once for the whole Move Action and the reactor chooses the square; a disrupted movement "ends in the square the creature was in" and its AP is wasted; Evade and Forced Movement never trigger it. With the Advance in one piece the movement left is lost. Today's Rebuke (an Appeal Save when an enemy Strikes an ally: damage, Pushed, Frightened) fires in 66% of rounds and is worth 14.

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You call out in your god's name, and your foe's stride falters and stops.*
> **Trigger:** An enemy within 5 squares of you moves closer to an ally.
> The triggering Move Action is disrupted, and the enemy is Hindered (EoT).

```
The Move Action disrupted: the enemy loses the AP it spent and the movement it had left
   about an AP taken from it (Dazed 1 is 11 to 15 a landing; 20 on an Elite) ... 11 to 15 each time   [SIM, by likeness]
Hindered (EoT): its next Advance this turn covers half ........................ 0 to 3 each time   [SIM: -2 to +2 from melee; a blind spot of the white room]
x it fires in about 60% of rounds ............................................. [judgment: Overwatch's same moment fired in 85% at 10 squares; within 5, less]
The ally it didn't reach that turn ............................................ not priced (the SIM can't see a back line: suggested 5 to 10)
--- Total: about 8 to 11 a turn on paper, more where there is a back line, of 10 to 15: on
```

**Analysis.**
- **It is the answer to "they stay in front so the squishies can stay back".** No roll: the enemy that runs at the Archer stops where the Paladin says. It can spend another AP to move again, at half Speed: so it costs the enemy about a third of its turn, not the whole of it.
- **The decision it gives:** which enemy, and where. He chooses the square on its path (the rule already lets a reactor wait): in the open, or next to himself, where Judge and his Weapon Attacks are.
- **It stops a Charge:** a Charge disrupted before its 3 squares makes no attack (Chapter 2's own example).
- **Two Reactions, two jobs:** Shield of Faith answers the hit; Rebuke answers the approach. With the Hallmark Actions (Lay On Hands shields, Binding Light pins) a Paladin can take one of each and cover both, or double one.
- **What it can't do:** an Evade, a Forced Movement or a teleport doesn't trigger it; an enemy already next to the ally isn't moving; a ranged enemy doesn't need to. One a round, unless he kept AP.
- **The rules it touches:** none new. "Disrupted" without a Critical is rare in the book (it "usually" comes with one): this is a certain disrupt, once a round, within 5 squares. Worth Lucas's eye.
- **Siblings:** the Archer's Overwatch (the same moment, at 10 squares: a Weapon Attack, Hindered on a hit). The Archer shoots the runner; the Paladin stops him. Today's Rebuke is replaced (its Frightened and Push are free for other cards).
- **Complexity:** one Version, 13 words, one condition, no conditional.
- **Table feel:** the GM moves the token, the Paladin's player says "Rebuke, stop there", and the token goes back to that square. Everyone sees it. The risk: a GM may feel it as losing the monster's turn; it is one AP, and the monster still acts.

**For Lucas to choose:** a certain disrupt, or a Save (Tier 1 for the enemy: disrupted and Hindered; Tier 2: Hindered; Tier 3: nothing); Hindered as the rider, or Frightened of you (EoT), or none; 5 squares.

**Lucas's notes (2026-11-14), applied, with what the rules say:**
- **The trigger.** He finds "moves closer to an ally" good, "uses a Move Action" too good and disruptive, and offered "moves away from you" for simplicity. **Claude's answer: "moves away from you" is the best of the three.** With allies spread out, almost any forward step is closer to some ally, so "closer to an ally" plays like "uses a Move Action" and makes the table check every ally. "Away from you" is checked against one creature, him; it never punishes an enemy coming at him; and it is the front line in one phrase: to get past him an enemy must at some point move away from him. It is 13th Age's intercept and Lancer's engagement in our words. **It isn't a defined moment yet:** Chapter 2's "Moving Closer" gets its mirror ("a creature moves away from you when the distance is larger after its movement than before").
- **A Save for the disrupt, Hindered automatic.** [Power, Save], so the DC is 11 + his Power Modifier (13). Appeal over Mind: today's Rebuke is an Appeal Save, and it is a command, not a puzzle.
- **"Disrupted / Disrupted / No effect" clutters: is there a better way to write a binary Save?** From the rules: a Save's three values are its Tier 1 / 2 / 3 results, and on a Save Action the Effects row "happens on Tier 1 and 2". So the book already knows the pair "Tier 1 and 2"; it has no short way to write it on one line. **Proposed, as a writing rule:** a Tier line can name two Tiers, and a Tier that isn't written does nothing. "**Tier 1 or 2:** its Move Action is disrupted." Other options looked at and set aside: "Appeal Save negates" (4e and 5e's phrase; a new term to define); "unless it resists" (Resist is already the damage word).
- **Is there a rule for Hindered during a movement?** Yes, Chapter 8: "If you become Hindered while you are moving, the movement you have left is halved too, rounded down." (Added for the Archer's Overwatch.) So even on a Tier 3 the enemy loses half of what it had left.
- **Hindered is the rider. 3 squares.**

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Power, Save] · Vs.: Appeal Save
> *You call out in your god's name, and your foe's stride falters and stops.*
> **Trigger:** An enemy within 3 squares of you moves away from you.
> The enemy is Hindered (EoT) and makes an Appeal Save. **Tier 1 or 2:** its Move Action is disrupted.

```
Hindered (EoT), always: the movement it has left is halved, and its Speed for the rest of its turn ... 0 to 3 each time   [SIM; a blind spot of the white room]
The Move Action disrupted on a Tier 1 or 2 (about 80% against DC 13 for a creature with Appeal +2) ... 11 to 15 x 0.8 = 9 to 12 each time   [SIM, by likeness to Dazed 1; the odds computed]
x it fires in about 40% of rounds ..................................... [judgment: narrower than "closer to an ally", and 3 squares]
The ally it didn't reach ................................................ not priced (suggested 5 to 10 on a map with a back line)
--- Total: about 4 to 6 a turn on paper, 10 to 15 where enemies try to get past him, of 10 to 15: on where it matters, under in a white room
```

**What changed in play:** it is no longer certain (one time in five the enemy keeps going, at half pace), it reaches less far, and it only answers an enemy leaving him. That is a softer, clearer card, and the GM keeps a roll. Its weak case is a fight where nobody tries to pass him: then Shield of Faith is the better pick, which is a fair reason to have two.

**For the book, with this card (logged; not applied):** "moving away from you" defined beside "Moving Closer" (Chapter 2); a Tier line can name two Tiers, and an unwritten Tier does nothing (rules-src/README.md and Chapter 1's card anatomy).

**Lucas's answer (2026-11-15):** decided as revised. "Log that we need a rulings for 'Moving away', since we want to make the game having the least amount of ambiguity." Logged in the rules backlog with the questions the ruling must answer. With it he stated the system's purpose: **fun, engaging, tactical, and with the least ambiguity** (in CLAUDE.md now).

## Where the Paladin stands (level 1, after decision 7)

| Slot | Card | Status |
|---|---|---|
| Numbers | Weapon +1, Power +2; Health 20 / 10; Rally 6; Speed +0; Heavy | decided |
| Feature | **Judge** (the mark; 0 AP / 1 AP) | decided |
| Feature | **Smite** (the burst; Encounter, 2 AP) | decided |
| Hallmark Action | **Binding Light** (2 AP Strike; Immobilized) or **Lay On Hands** (Guard; 2 AP: a Rally Point) | decided |
| Hallmark Reaction | **Shield of Faith** (a smaller hit, Taunted) or **Rebuke** (stops an enemy moving away) | decided |
| Art (1 of 3) | three to design | next |
| Escalation 2 Passive (1 of 2) | two to design | after the Arts |

## Decision 8: the first Art, light (PROPOSED, waiting for Lucas)

Lucas (2026-11-15): the three themes are good (light, the line, the word); start with light.

**Rules and research first.** Light is fully written (Chapter 3): a source sheds Bright light N in an N Emanation and Dim light as far again; what matters is the light **where the target is**; a creature in Bright light is Clear to Sight, in Dim light Obscured, in Darkness unseen (Hidden if it is heard). Perceiving a creature as Obscured gives your Actions against it 1 Field Bane **and its Actions against you 1 Field Boon**; as Hidden, Doomed and Favored. A torch is Bright light 4 and takes a hand. **Hide is not written** ("Hiding and sneaking are not written yet"), so nothing here leans on it. Research: holy light as a tool is rare and liked on paper (Pathfinder 2e's Flash of Grandeur lights the attacker so it can't be concealed; a guide: it "punishes hidden tricks"; Draw Steel's Exorcist: judged creatures can't Hide); 5e's Sacred Weapon only sheds light. An Art is "the card you look at when attacking isn't the answer": no damage, up to three uses, each one thing.

> **Lantern of Faith** · Paladin Art · Round · 1 AP · [Divine]
> *You call your god's light: around you, onto a foe, or into a foe's eyes.*
> **Kindle:** You shed Bright light 3 until the encounter ends.
> **Reveal:** One creature you perceive within 5 squares sheds Bright light 1 (1 round).
> **Glare:** One enemy you can see within 5 squares perceives creatures more than 3 squares from it as Obscured (EoT).

```
Kindle (a torch that needs no hand, around the front-liner)
   in daylight ................................ 0
   in Dim light or Darkness ................... not priced (it turns Obscured or Hidden enemies within 3 squares of him into Clear ones for the whole party: a Bane or a Doomed roll removed from every attack on them; large where it applies)
Reveal: one creature lit for a round
   in daylight ................................ 0 to 5   [the earlier analysis: Bright light on a creature]
   on a creature in Dim light or Darkness ..... about a Boon to Favored on every attack against it that round: 10 to 30   [judgment: a Boon is about 9% of a roll, Doomed about -44%]
Glare: an enemy sees everything beyond 3 squares as Obscured, for its turn
   1 Field Bane on its ranged Actions ......... 3 to 5   [judgment: a Bane on an enemy's Strikes for a turn]
   1 Field Boon for allies more than 3 squares away who attack it (the Archer's 2 to 3 shots) ... 5 to 7   [judgment]
--- Kindle and Reveal: 0 in a lit room, strong in the dark. Glare: about 8 to 12 for 1 AP (of 25) anywhere: the use that works in daylight.
```

**Analysis.**
- **The decision it gives:** is this a fight where light matters? In a cave it is the best AP he has: one Kindle and the enemies around him stop being Hidden for the whole party. In daylight two of the three uses do nothing, and Glare is his answer to an enemy that shoots: the one enemy Rebuke and Binding Light can't touch.
- **Glare helps the Archer twice:** the enemy shoots worse, and the Archer (more than 3 squares away) shoots it with a Boon. That is soft support through light, with no number written on the card: the Obscured rule does it.
- **Wide, not strong:** three small tools. In points it is under a Weapon Attack almost always; that is what an Art is for.
- **Rules it touches:** none new for Kindle and Reveal ("sheds Bright light N" is the Light section's own notation; today's Smite already does it to a target). Glare makes creatures Obscured to one creature by an effect, not by light: the Senses rules allow it (Blinded works the same way, harder), and Hearing can't make them clearer than Obscured. **For when Hide is written:** a creature that sheds light can't Hide (proposed; logged).
- **Siblings:** today's Smite (the target sheds Bright light 1 or 2 and takes a Bane to Hide) and Final Verdict's light: this takes their place. Beacon's Aura is a different card.
- **Complexity:** three uses, 10, 11 and 16 words, no condition, no conditional, no number but distances.
- **Table feel:** Kindle is said once and forgotten (good); Reveal and Glare are "that one" moments. The risk: a table that never plays in the dark and never meets a ranged enemy will find it empty; it is one of three Arts, and a Rest swaps it.

**For Lucas to choose:** the name; whether all three uses cost 1 AP (Kindle could be 0 AP: it happens once a fight); Glare's 3 squares and its "(EoT)"; whether Reveal should also do something in daylight.

**Lucas's answer (2026-11-15):** "Really really cool... This is the type of thing that was missing, roleplay focused abilities that aren't strong by themselves, but in the right situation, it is thematic, cinematic and cool." (Written into the charter as what an Art is for.) **His idea for Glare: a new condition between normal sight and Blinded, as Pathfinder 2e's Dazzled ("all targets are Obscured to you"), on a Save:** Tier 1: the condition (EoT) / Tier 2: creatures more than 3 squares from it are Obscured (EoT) / Tier 3: no effect. "Just an idea of course. What will answer if Null turns are ok or not will be playtesting only."

**Claude's thoughts (from the rules and our prices; no new search).**
- **Yes to the condition.** Glare's sentence was an effect invented for one card; a named condition is defined once and reused (another light card, a monster's flash, a creature of the dark dragged into Bright light), which is the "least ambiguity" purpose. Chapter 8 has Blinded ("for your Sight, everything is Darkness") and nothing between it and normal sight; the Senses table already has the middle state, Obscured. So the definition is one line. **Draft for Chapter 8: "Dazzled. Your Sight perceives no creature better than Obscured: a creature that would be Clear to you is Obscured. Your other senses aren't affected."** (By the Senses table: 1 Field Bane on its Actions against them, 1 Field Boon on their Actions against it.)
- **Its price** [judgment]: about 12 to 16 a landing, between Frightened's Bane on all rolls (2 to 4, 6 on an Elite) plus a Boon for everyone attacking it, and Blinded (EoT) (12 to 15; 26 on an Elite). A Moderate condition.
- **The odds** against DC 13 for a creature with +2 on the Save [computed]: Tier 1 28%, Tier 2 51%, Tier 3 22%. So his three-result line gives the full condition about a quarter of the time, the far-only version half the time, nothing a fifth of the time: about 9 points a use. A binary line ("Tier 1 or 2: Dazzled (EoT)") has the same one-in-five null, is one thing to read, and is worth about 11 to 13.
- **The Art's budget:** an Art's use is "one thing, about 20 words". His line is three results and 26 words; the binary one is one result and 14. Claude's lean: the binary line, with his three-result line as the fallback if Dazzled four times in five proves too strong for 1 AP.
- **Which Save:** Instinct (looking away in time) over Body.

**The card with it (Glare in the binary form; [Power, Save] on that use: DC 11 + his Power Modifier):**

> **Lantern of Faith** · Paladin Art · Round · 1 AP · [Divine]
> *You call your god's light: around you, onto a foe, or into a foe's eyes.*
> **Kindle:** You shed Bright light 3 until the encounter ends.
> **Reveal:** One creature you perceive within 5 squares sheds Bright light 1 (1 round).
> **Glare** [Power, Save]: One enemy you can see within 5 squares makes an Instinct Save. **Tier 1 or 2:** Dazzled (EoT).

**Lucas's answer (2026-11-15): B** ("Tier 1 or 2: Dazzled (EoT)"). **Lantern of Faith is DECIDED** with the card above; the condition's name is still open (he asked for other ideas).

**Names for the condition (Claude):** *Dazzled* is the plain word and the one Pathfinder 2e players know with the same meaning; its one flaw here is that it sits one letter from our **Dazed** (which takes AP), and the purpose is the least ambiguity. Alternatives: *Half-Blinded* (explains itself, pairs with Blinded), *Glare-Struck*, *Bleary*, *Sunstruck*, *Blurred*. Claude's order: Dazzled if the likeness to Dazed doesn't bother him, otherwise Half-Blinded.

**"Should Obscured be 2 Banes?" (Lucas: "I thought 1 Bane was a lot but I have come to the conclusion that it isn't so bad"). Claude's answer from the rules: keep 1.**
- **A Bane is -1 on 2d12:** against Defense 13 it takes about 7 points off the chance of a Tier 2 or better (65% to 58% at +1) and about 9% off a roll's worth. He is right that one is modest.
- **But Obscured is two-sided** (the Senses table): 1 Field Bane on your Actions against it **and** 1 Field Boon on its Actions against you. Between two creatures fighting each other that is already a swing of 2. At 2 and 2 it would be a swing of 4, close to Doomed.
- **The Field limit is 2** (Chapter 1: named Boons and Banes count up to 2 of each name). Obscured at 2 would fill it alone: Low cover, a creature in the line, or shooting into a melee would then add nothing in Dim light.
- **The ladders match today:** Low cover 1, Medium cover 2, High cover Doomed; Obscured 1, Hidden Doomed. At 2, Dim light would equal Medium cover.
- **And Dazzled would double in price** (to about 24 to 32 a landing): too much for a 1 AP use of an Art.
- A note found on the way: two creatures that are each Obscured to the other cancel out (each has the Bane and the Boon), so Dim light only matters when it is one-sided. That is the rules working as written; worth knowing when a fight is set at dusk.

**The condition's name: Half-Blinded (Lucas, 2026-11-15: "It is a long name, but makes sense"). Dazed stays Dazed.** Lantern of Faith's Glare: "Tier 1 or 2: Half-Blinded (EoT)."

**The Senses rule (Lucas: the table "is still confusing... maybe a diagram can help").** Rewritten as two questions asked in order, with four scenes on the reading page (for the book: one diagram in the book's style, Y is you). **1. Your eyes:** how you perceive your target sets your penalty (Clear: none; Obscured: 1 Field Bane; Hidden: Doomed; Unsensed: you can't target it). **2. Its eyes:** only if you perceive it better than it perceives you, you get a bonus: 1 Field Boon if you are Obscured to it, Favored if you are Hidden or Unsensed to it. The scenes: a torch in the dark (Y in Darkness, G in the light: Y Favored, G Doomed); both at the edge of the light (both Obscured: 1 Field Bane each); Glare (G Half-Blinded: Y 1 Field Boon, G 1 Field Bane); both in the dark (both Doomed). **Two cases change from today's rule:** each Obscured to the other (1 Field Bane each; today normal), and "you only hear a creature that can't sense you" (Doomed and Favored cancel to a normal roll; today Doomed).

## Decision 9: the second Art, the line (PROPOSED, waiting for Lucas)

**Rules and research first.** Difficult Terrain (Chapter 3): each square counts double; an unwilling creature's space already is Difficult Terrain. Reposition (Chapter 3): moves a creature of your choice along a path, isn't Forced Movement, triggers no Reactions, ignores Difficult Terrain, is reduced by Steadiness. A creature is willing when it accepts; an Unconscious one counts as willing. Interact (1 AP) already helps a Prone creature stand and an Imperiled one to safety. The Basic Action Relocate rolls for a Reposition 1 or 2. Research: a front line is real when passing the front-liner costs movement or actions (Lancer, 13th Age); visible protection moves a token (Draw Steel's Parry and No Dying on My Watch move to the ally); granted movement is a "quarterback" tool, worth most on the ally who needs it. Lucas (2026-11-14): an ally's step out of reach is "more a skirmishing thing".

> **Hold the Line** · Paladin Art · Round · 1 AP
> *You plant yourself where the fight is worst: you foul the ground at your feet, trade places with an ally, or haul one clear.*
> **Brace:** Until your next turn starts, squares adjacent to you are Difficult Terrain for enemies.
> **Trade Places:** You and a willing ally within Reach swap squares. Each of you is moved by a Reposition.
> **Haul:** Reposition 2 a willing ally within Reach.

```
Brace ............. not priced (the SIM has never measured Difficult Terrain around a creature; suggested 0 to 8: an enemy passing him pays double for up to 8 squares)
Trade Places ...... about 10 to 15   [judgment: two moves for 1 AP with no Reactions; an Evade given to an ally was priced 10 to 15]
Haul .............. about 15   [judgment: the earlier price for an ally's Evade 2]
--- Each under a Weapon Attack (25) in points; no number on the card but distances.
```

**Analysis.**
- **The decision it gives:** where the line is this round. Brace when they will try to run past; Trade Places when a hurt ally stands in the front and he should; Haul when someone is Down in a bad square.
- **Brace with his Reactions:** an enemy that pays double to get past him is still near him when Rebuke's "moves away from you" comes.
- **Trade Places is "they stay in front" as a verb:** the Archer who got caught is behind him at the end of his turn, and no Reaction answered it.
- **Haul works on a fallen ally** (Unconscious counts as willing), out of a Zone or away from the enemy standing over it. With Lay On Hands' 2 AP use next turn, that is his rescue.
- **Rules it touches:** "swap squares" isn't defined: the card says each is moved by a Reposition, so every question has its answer (no Reactions, not a Move Action, Steadiness applies). To add: creatures of different Sizes can't swap. Brace makes terrain "for enemies": Difficult Terrain for some creatures only already exists (Darkness, for those who can't see in it).
- **Lucas's note on steps:** Haul and Trade Places move an ally. Claude kept them because he moves the ally with his own hands and stays beside it: a bodyguard's act, not a skirmisher's grant. His call.
- **Siblings:** the Basic Actions Relocate (rolls; works on enemies) and Interact (helps a Prone creature stand). Bulwark of Faith's Slid 1. Beacon's Step.
- **Complexity:** three uses of 14, 16 and 7 words; no condition, no conditional, no dice.
- **Table feel:** three verbs anyone understands. The risk: Brace is invisible unless the GM counts squares; Foundry would need to mark those squares (a Zone that follows him exists: not tried).

**For Lucas to choose:** keep Haul and Trade Places, or replace one (a candidate: "Stand: you can't be moved by Forced Movement until your next turn starts"); Brace's "adjacent" or a 1 Emanation is the same thing: the wording.

**Lucas's answer (2026-11-15):** "Interesting, I was planning on saving most of those for a more Guardian build, but I think this doesnt remove the possibility of a full-tank class to have similar." His question: Trade Places and Haul aren't [Handle], "so no reactions triggered and no free hands necessary?" **Yes** (Chapter 7: Handle means you must be able to use your hands and have one free; nothing in our rules triggers a Reaction on a Handle Action, and a Reposition never triggers one). Kept without Handle on purpose: they work with a Greatsword or a shield in hand. **His correction:** the "skirmishing thing" was the Paladin himself stepping out of reach; moving an ally is fine, "though it fits more of a commander-type class". **Renamed by Claude: Haul is Rescue** (the Basic Actions already have a Haul). **Taken as DECIDED unless he objects:**

> **Hold the Line** · Paladin Art · Round · 1 AP
> *You plant yourself where the fight is worst: you foul the ground at your feet, trade places with an ally, or carry one clear.*
> **Brace:** Squares adjacent to you are Difficult Terrain for enemies (1 round).
> **Trade Places:** You and a willing ally within Reach swap squares. Each of you is moved by a Reposition.
> **Rescue:** Reposition 2 a willing ally within Reach.

**For a future Guardian (noted):** the stronger versions stay free for it (a Reaction that swaps, a bigger Reposition, terrain that lasts).

**The Senses diagram (Lucas, 2026-11-15):** "Much better", and he specified the arrows: a curved green arrow on top from Y to G with how Y perceives G, a curved orange one at the bottom from G to Y, a straight green arrow Y to G with Y's result, a straight orange one G to Y with G's. Drawn so on the reading page (four scenes). **His question on "you only hear a creature that can't sense you":** would it stop you perceiving creatures through walls? No: hearing is unchanged (every creature in combat within 10 squares is Hidden to you, through walls). That case is the reverse (the target can't sense you), which in a fight needs Hide; **it is taken out of this change and left for the Hide session** (his plan for Hide, noted: 1 AP, usable while you are Hidden, an attempt that makes you Unsensed; "soooo many holes" to work through in its own session). So the Senses change is one case only: each Obscured to the other = 1 Field Bane each.

**Lucas (2026-11-15):** Hold the Line is good, "note down about swapping places rule" (noted in the rules backlog). **The diagram's colors were meant as good and bad, not who:** green for a good perception or result (Clear, a Boon, Favored), orange for a bad one (Obscured, Hidden, a Bane, Doomed). Redrawn so.

## Decision 10: the third Art, the word (PROPOSED, waiting for Lucas)

**Rules and research first.** Taunted (Chapter 8): your Actions against any creature other than its source take 1 Bane; the SIM prices it at 1 to 3 on a hit. Frightened: of a source; 1 Bane on all your rolls while you see it, and every square toward it is Difficult Terrain. Prone: melee Actions against you gain 1 Field Boon, ranged ones take 1 Field Bane, and standing is the Stand Action (1 AP); 7 to 9 on a hit, 11 against an Elite. Research: a soft taunt alone was ignored on the Pathfinder 2e Guardian ("there was not really a reason for the monsters to attack me") and works as the second half of a trap; Pathfinder 2e's Obedience cause is the command "kneel"; 5e's and Pathfinder 2e's Aura of Courage steady allies near the paladin, and the always-on aura is the forgotten kind. Lucas: ending a condition is "a healer thing".

> **Commanding Word** · Paladin Art · Round · 1 AP · [Divine]
> *You speak with your god's authority: you call a foe to face you, steady the hearts around you, or order a foe to its knees.*
> **Challenge:** One enemy within 5 squares is Taunted by you (1 round).
> **Courage:** Until your next turn starts, you and allies within 3 squares of you ignore the Frightened condition.
> **Kneel** [Power, Save]: One enemy within 5 squares makes an Appeal Save. **Tier 1 or 2:** Prone.

```
Challenge ...... 1 to 3   [SIM: Taunted]; more with Judge and Shield of Faith behind it [not priced]
Courage ........ 0 in a fight with no fear; not priced where there is (a Bane on every roll and Difficult Terrain lifted from each ally near him)
Kneel .......... 7 to 9 a landing [SIM: Prone] x 78% [computed: an enemy with +2 against DC 13] = about 6 to 7
--- Each well under a Weapon Attack (25).
```

**Analysis.**
- **The decision it gives:** which word. Challenge when an enemy he can't reach is choosing its target; Kneel on the enemy an ally is about to hit in melee; Courage when something frightening is on the field.
- **Challenge is the soft taunt at range for 1 AP:** weak alone, by the research; it earns its place because the Judged creature's hits are smaller and Shield of Faith waits.
- **Courage prevents, it doesn't cure:** one condition suppressed near him for a round, declared and paid for (not an always-on aura). Whether that is still "a healer thing" is Lucas's call.
- **Kneel takes an AP** on four uses in five, with no damage: about a quarter of a Weapon Attack in points. As an every-round rider on a Strike it was a controller's tool; as a 1 AP Art with a Save it is small.
- **Rules it touches:** "ignore the Frightened condition" needs a sentence (the condition stays and does nothing while they are within 3 squares of him). The three conditions are Chapter 8's.
- **The charter:** "a card names at most one condition"; an Art would read it as one a use. To confirm.
- **Siblings:** Shield of Faith's Taunted (on the hit); today's Rebuke had Frightened on enemies (free now: not used here); Trip (a Basic Action: Prone on a Tier 3 for 1 AP, on a Tier 2 for 2 AP, by a roll against the target).
- **Complexity:** three uses of 10, 17 and 13 words.
- **Table feel:** each is one spoken line at the table ("Face me." / "Stand fast." / "Kneel."). The risk: Kneel may be the only one used.

**For Lucas to choose:** Courage, or another third word (a candidate that isn't a condition: "Oath: name one ally; until your next turn starts, Shield of Faith reaches it at 10 squares"); Kneel's Save (Appeal); the name.

**Lucas's answer (2026-11-15):** the arrows are good. The name: "a better, more divine name is welcomed". **Courage's duration: he is "trying to stray away from 'until the start of turn', keep only EoT or Rounds". Should he give in? And if so, should rounds count down at the start of the turn? "Search this a bit intensively."**

**Claude's answer (research saved in `book/research/durations.md`): keep only EoT and rounds, don't move the count, and write "(1 round)".**
- **Other games:** Draw Steel has no rounds and writes "until the start of your next turn" 47 times in its classes, always for something the hero holds up, with EoT (the end of the affected creature's next turn) for conditions on targets. Pathfinder 2e counts rounds at the start of the creator's turn but ends harmful effects on the target's turn; its Foundry system has an open request to say on whose turn an expiry falls (four cases). 4e's "until the end of your next turn" gave the origin a second bite ("one of his actions and then your next turn"), and tables house-ruled it to the target's turn. 5e uses both with no stated rule.
- **The lesson:** the trouble is the number of end points. We have two (EoT: the target's turn ends; rounds: the origin's slot ends). A third is the thing to avoid.
- **Why not count at the start:** counting at the end guarantees that every creature, the one whose turn the effect was made in included, takes one full turn under it. Shield of Faith's Taunt is made on the enemy's turn: counted at the end it covers that enemy's next turn; counted at a start it would cover only what is left of this one, or a length set by Initiative order alone.
- **What "(1 round)" costs on a thing he holds up:** it also covers his own next turn. For Brace and Courage that is harmless.
- **One spot in the book that already means start-to-start:** the unused AP's Guard (Chapter 2 defines it in full, so it isn't ambiguous). Noted.

**The cards with it (the name is Claude's pick: Commandment; others: Decree, Litany, Edict):**

> **Commandment** · Paladin Art · Round · 1 AP · [Divine]
> *You speak with your god's authority: you call a foe to face you, steady the hearts around you, or order a foe to its knees.*
> **Challenge:** One enemy within 5 squares is Taunted by you (1 round).
> **Courage:** You and allies within 3 squares of you ignore the Frightened condition (1 round).
> **Kneel** [Power, Save]: One enemy within 5 squares makes an Appeal Save. **Tier 1 or 2:** Prone.

**And Hold the Line's Brace, the same way:** "Squares adjacent to you are Difficult Terrain for enemies (1 round)."

**Lucas's answers (2026-11-15):** no save ends: agreed. Durations: yes (only EoT and rounds, counted as today; "(1 round)" on what he holds up). The name: **Commandment**. Courage stays. **Commandment is DECIDED** with the card above; **the three Arts are done** (Lantern of Faith, Hold the Line, Commandment).

**"(T1/T2)" or "Tier 1 or 2:": how much space is saved, is it worth it? (Lucas)** Almost none: on Rebuke, "makes an Appeal Save. **Tier 1 or 2:** its Move Action is disrupted" against "makes an Appeal Save: its Move Action is disrupted (T1/T2)" is two words and about eight characters. Not worth it, and the parentheses cost clarity twice: they are an abbreviation to learn, and they pile onto the duration's parentheses ("Prone (EoT) (T1/T2)"). **Decided by Claude as the default (his to revert): "Tier 1 or 2:" stays, and the book's "(T3)" / "(T2/T3)" notation is retired in the same pass that changes the Effects row**, since Tier lines now do its job. One way to write a Tier.

## Where the Paladin stands (level 1 complete but the Passive)

| Slot | Card | Status |
|---|---|---|
| Numbers | Weapon +1, Power +2; Health 20 / 10; Rally 6; Speed +0; Heavy | decided |
| Features | **Judge**, **Smite** | decided |
| Hallmark Action | **Binding Light** or **Lay On Hands** | decided |
| Hallmark Reaction | **Shield of Faith** or **Rebuke** | decided |
| Arts (1 of 3; a second at level 3) | **Lantern of Faith**, **Hold the Line**, **Commandment** | decided |
| Escalation 2 Passive (1 of 2) | Armor of Faith proposed; one more to design | now |

## Decision 11: the first Escalation 2 Passive, Armor of Faith (DECIDED with Lucas's change, 2026-11-15; the card at the end of this section)

**Rules and research first.** A Passive works while his Escalation is at least its number: Escalation 2 is round 2, or the first turn with Momentum. The charter: one sentence; it changes a decision or fires on a moment the table sees; never a silent bonus; about +5 to 10 a turn. Guard doesn't stack (the higher value), except the unused AP's, which adds. Research: the soft front-liner that works "is paid when it protects" (Draw Steel gives temporary Stamina or resource on the trigger; Nimble's Oathsworn gains temp HP when he Interposes); always-on bonuses are forgotten. His Reactions fire in about half the rounds. Today's Escalation 1 Passives (Radiant Zeal, Divine Surge, Font of Mercy) are silent pluses and are retired.

> **Armor of Faith** · Paladin Escalation Passive · Escalation 2
> *Each time you answer for an ally, your god's light settles on you like mail.*
> While your Escalation is 2 or more, when you use a Reaction, you gain Guard equal to 1 + your Power Modifier.

```
Guard 3 on himself, each time he reacts ............ 18   [SIM: 6 a point of Guard]
x his Reactions fire in about half the rounds ........ 9 a round
x Escalation 2 or more: rounds 2 to the end (about 70% of a fight's turns; all of them with Momentum)
--- Total: about 6 a turn (9 with Momentum), of 5 to 10: on
```

**Analysis.**
- **The decision it changes:** whether to react at all. Shield of Faith Taunts the enemy onto him; this is what lets him take that hit. Rebuke stops an enemy next to him; the same. It also raises the value of an AP kept for a second Reaction (a second Guard doesn't stack, but it refreshes one that was spent).
- **It fires on a moment everyone already watches** (his Reaction), with the number Shield of Faith already uses (1 + Power Modifier): nothing new to remember.
- **"Paid when he protects"** is the research's best answer to how a soft tank stays up: his toughness comes from doing his job, not from a bigger Health Pool.
- **Smite:** the Reaction AP spent on Smite is not a Reaction, so no Guard. Smite stays the exposed turn.
- **Rules it touches:** none. Guard's own rules settle the stacking (it adds to the unused AP's Guard; it doesn't add to itself).
- **Siblings:** Bulwark of Faith and Divine Intervention gave allies Guard; the old Divine Surge had a Guard that was cut as too strong (2d6). This is 3, on him only.
- **Complexity:** one sentence, 20 words.
- **Table feel:** "Shield of Faith: minus 3, it's Taunted, I gain Guard 3." One breath. The risk: it is a number, if a triggered one; Lucas's rule is no *silent* bonus, and this one is said aloud each time.

**The second Escalation 2 Passive (not drafted yet; Claude's candidates, for Lucas to steer):** *the mark moves freely* ("moving your Judgment costs 0 AP"); *the mark glows* ("the creature you Judged sheds Bright light 1"); *Lucas's own idea* of a penalty on the Judged creature (he placed it at Stage 1).

**Lucas's answer (2026-11-15):** "'When you use a reaction' is too broad for a system that you get talents frequently, and your build is more talents than class": either class Actions and Talents get a class trait ("Paladin Reactions"), or the card says [Divine], and later Talents can carry [Divine] to work with it. "I think I would go with divine trait to allow expanding later on." **Done: "a [Divine] Reaction".** (Shield of Faith and Rebuke both have the trait. Chapter 7 already says a trait with no rule of its own, "such as Divine", is there for other rules and features to use.) **A rule for every class card from here: a card that counts "your Reactions" or "your Actions" names a trait, never all of them** (in the charter).

> **Armor of Faith** · Paladin Escalation Passive · Escalation 2
> *Each time you answer for an ally, your god's light settles on you like mail.*
> While your Escalation is 2 or more, when you use a [Divine] Reaction, you gain Guard equal to 1 + your Power Modifier.

## Decision 12: Weight of Judgment (DECIDED, Lucas, 2026-11-15: Speed reduced by 2, at **Escalation 4**, the name kept)

Lucas (2026-11-15): "Penalty to speed isn't a bad idea."

**Rules and research first.** Every NPC has Speed 5 unless it says otherwise, and the Bestiary calls Speed "strong": a creature of Speed 4 or less "is easy to avoid and to keep away". Exhausted is the book's model for a Speed penalty ("your Speed is reduced by the value (to a minimum of 1)"). Hindered halves Speed. The SIM: -1 Speed on a Standard is worth 0.7 on the open field and 1.1 to 3.4 on maps (in the old unit, over 3 rounds: about 1 to 6 points a turn). The charter: a later Passive can expand an Action he already has, as a standing effect on the one Judged creature, written into Judge's own text. Research: the Pathfinder 2e Champion's reaction grows this way; Draw Steel's Censor buys "its speed becomes 0" on his judged enemy; 4e's Divine Challenge failed while the enemy could walk it off.

> **Weight of Judgment** · Paladin Escalation Passive · Escalation 2
> *Your judgment hangs on your foe like a chain, and its steps drag.*
> While your Escalation is 2 or more, a creature Judged by you has its Speed reduced by 2 (to a minimum of 1).

```
-2 Speed on the Judged creature (a Standard: 5 to 3) ... 2 to 12 a turn   [SIM: -1 Speed measured about 1 to 6 a turn, the low end on an open field; doubled: judgment]
x Escalation 2 or more (about 70% of a fight's turns; all with Momentum)
--- Total: about 2 to 8 a turn (more on maps with a back line), of 5 to 10: on where movement matters, under on an open field
```

**Analysis.**
- **The decision it changes:** whom to Judge. With it, the mark is also a leash: the enemy that wants the back line gets there a turn later, or not at all (Speed 3 can still Charge; Rebuke's Hindered halves it to 1).
- **It is the line-holder's Passive** as Armor of Faith is the shield's: one for each style, though either Paladin can take either.
- **It is written into Judge** (the charter's rule): Judge's text gains "(Escalation 2: its Speed is reduced by 2, to a minimum of 1)" for the Paladin who took it. One card to read.
- **No trigger to remember:** a standing number on one creature; Foundry can hold it as an effect on the Judged token (not tried).
- **The mark has no range limit once placed**, so a slowed enemy can't shake it by distance: 4e's flaw doesn't apply.
- **What it does nothing against:** a ranged enemy that doesn't need to move; a creature that Evades or teleports the same squares.
- **Lucas placed this idea at Stage 1**; at Escalation 2 it is on from round 2 at level 1. If that is too early, it is the natural Escalation 4 Passive (level 2) instead.
- **Complexity:** one sentence, 23 words.
- **Table feel:** the GM counts 3 squares where he expected 5: it is felt on the map every turn the creature moves.

**For Lucas to choose:** 2 or 1; Escalation 2 (level 1) or Escalation 4 (level 2); the name.

**Lucas's answer (2026-11-15):** 2; Escalation 4; "Good name". **So Weight of Judgment is an Escalation 4 Passive (level 2):**

> **Weight of Judgment** · Paladin Escalation Passive · Escalation 4
> *Your judgment hangs on your foe like a chain, and its steps drag.*
> While your Escalation is 4 or more, a creature Judged by you has its Speed reduced by 2 (to a minimum of 1).

(At Escalation 4 it is on from round 4 with no Momentum, round 2 with Momentum 2: about a third of a first fight's turns, most of a later one's. Its worth a turn drops to about 1 to 4 in a first fight; a Passive at this rung is meant for the long and the later fights.)

## The Passives' table

| Rung (level) | Passive 1 | Passive 2 |
|---|---|---|
| Escalation 2 (level 1) | **Armor of Faith** (decided) | Roving Judgment (proposed below) |
| Escalation 4 (level 2) | **Weight of Judgment** (decided) | to design |
| Escalation 6 (level 3) | to design: a "when your Escalation becomes 6" moment | to design |

## Decision 13: the second Escalation 2 Passive, Roving Judgment (DECIDED as proposed, Lucas, 2026-11-15)

**Rules and research first.** Judge's 1 AP use moves the mark ("the target is Judged by you instead of the one you had"); Judge is a Turn Action (once a turn). The marks players accept are cheap to move (Draw Steel's Judgment is a maneuver, every turn; the 2024 ranger's mark was disliked because it cost a bonus action and fought his other buttons; 4e's Divine Challenge was a minor action). The Archer pays 1 AP too (Mark Quarry). The charter: a Passive can expand an Action he has, written into its text.

> **Roving Judgment** · Paladin Escalation Passive · Escalation 2
> *Your eye passes from one guilty foe to the next, and your god's attention follows it.*
> While your Escalation is 2 or more, the 1 AP use of Judge costs you 0 AP.

```
1 AP saved on the turns he moves the mark (about a third of them) ... 4 to 8 a turn   [judgment: an unused AP is 12 (SIM), a spent one up to 25]
The mark sits on the right enemy more often: Judge's reduction lands in more rounds, Smite finds a Profane target ... about 3 to 5   [judgment]
x Escalation 2 or more (about 70% of a fight's turns; all with Momentum)
--- Total: about 5 to 9 a turn, of 5 to 10: on
```

**Analysis.**
- **The decision it changes:** the first Judge stops being a commitment. Each round from the second he asks again "who is the danger now", which is a board question, the kind the redesign wants.
- **It is the opposite style to Armor of Faith:** that one rewards holding a Reaction; this one frees an AP on his own turn, for a Commandment, a touch, a step.
- **With Weight of Judgment (Escalation 4):** the leash follows his eye, to whichever enemy is about to run.
- **With Smite:** he can Judge the wounded enemy and Smite it the same turn with the bigger dice, for no AP: the finisher the research recommends.
- **What it costs the design:** "whom to Judge" matters less in round 1, because the answer can change for free from round 2. Still once a turn (Judge is a Turn Action).
- **Written into Judge's text** for who takes it: "1 AP (0 AP at Escalation 2 or more)".
- **Complexity:** one sentence, 17 words.
- **Table feel:** "I Judge that one instead" each turn, at no cost: quick. The risk: a player who forgets the mark moved; Foundry already tracks the Archer's.

**For Lucas to choose:** this, or the glow ("the creature you Judged sheds Bright light 1"), or another idea of his; the name.

**Two questions from Lucas before his answer (2026-11-15), answered from the rules:**

**1. "Judge is once a turn, so if you take 2 creatures down, you can't judge, maybe change this?"** He is right. Judge was written "Turn" (copied from the Archer's Mark Quarry), and Chapter 2 says a Turn Action is used "once on your turn, and once on each other creature's turn": the 0R use after the first Judged creature goes Down spends it, so a second one going Down the same turn leaves him with no mark until the next turn. **Fix: Judge has no Frequency (At-will).** He has only one mark, so using it twice in a turn stacks nothing, and Chapter 2 says At-will "has no mechanical effect" on an Action with no roll. If a later card rewards "when you Judge a creature", that card limits itself (as Draw Steel does: "the first time on a turn that you use your Judgment"), not Judge. **The Archer's Mark Quarry has the same hole** (noted for its redesign).

> **Judge** · Paladin Feature · At-will · [Divine] · Distance 10 sq. · Target: one enemy you can see
> *You pronounce a foe guilty before your god, and holy light dulls its blows against those who stand near you.*
> **0 AP:** At the start of an encounter, or as a 0R when the creature you Judged goes Down: the target is **Judged** by you until the encounter ends.
> **1 AP:** The target is Judged by you instead of the one you had.
> A creature stops being Judged when it goes Down. A creature Judged by you counts as Profane for you. The first time each round it damages an ally within 5 squares of you, that damage is reduced by your Power Modifier.

**2. "Does action points on your turn turn into reactions? If you have a 1R triggering twice during your turn, can you do it? Or your AP only becomes R when your turn ends?"** Chapter 2, Reactions: a Reaction is paid "with your Reaction AP, with AP you kept from your turn, or with both"; and **"On your own turn, your turn's AP can pay for it too."** So yes, during his own turn his AP can pay for Reactions; he doesn't have to wait for the turn to end. What stops the same Reaction twice is its Frequency, not the AP: Shield of Faith and Rebuke are Turn, so each can be used once on his turn and once on each other creature's turn, as long as he can pay. Two different Reactions on the same turn are fine.

**Lucas's answer (2026-11-15): "Good, proposed."** Roving Judgment is decided; Judge without a Frequency: good.

## Decision 14: the second Escalation 4 Passive, Tireless Vigil (DECIDED as proposed, Lucas, 2026-11-15)

**Rules and research first.** Chapter 2: at the start of your turn you gain 4 AP and 1 Reaction AP; the Reaction AP pays only for Reactions; "losing or gaining AP never changes your Reaction AP" unless a feature says so. His Reactions are Turn (once on each creature's turn). Research: one reaction a round is the protector's whole budget, and enemies learn it ("one enemy can blow your reaction and then another can target a squishy without consequence"); the Pathfinder 2e Champion gets a second reaction, for his champion's reaction only, from a feat (Divine Reflexes), and it is among the class's most wanted; his reaction "grows instead of multiplying". Escalation 4 is round 4 of a first fight and round 2 with Momentum 2: the Passive of the long and the later fights (13th Age gates its bigger abilities at about this point). Our rule: a card that counts Reactions names a trait.

> **Tireless Vigil** · Paladin Escalation Passive · Escalation 4
> *The longer the fight lasts, the less escapes you: your guard is on two allies at once.*
> While your Escalation is 4 or more, you gain 1 more Reaction AP when you regain AP. It pays only for [Divine] Reactions.

```
A second [Divine] Reaction a round: it fires in about a third of rounds (the first one takes the best trigger) ... [judgment]
   each time: Shield of Faith about 38, Rebuke about 12 to 18 ........ about 5 to 12 a round   [the cards' own prices]
   with Armor of Faith: Guard 3 again (refreshed, not added) .......... + about 3
x Escalation 4 or more (about 30% of a first fight's turns; about 70% with Momentum 2)
--- Total: about 2 to 5 a turn in a first fight, 5 to 10 in a later one, of 5 to 10: on in the fights this rung is for
```

**Analysis.**
- **The decision it changes:** the enemy's trick against him stops working. Today a GM can draw out his one Reaction and then send the second attacker at the Archer; with this he answers both, once each (his Reactions are once on each creature's turn).
- **It is the shield's Passive at this rung,** as Weight of Judgment is the line-holder's; either Paladin can take either.
- **It softens Smite's cost, late:** the Reaction AP spent on Smite still leaves this one, which pays only for [Divine] Reactions. At Escalation 4 the exposed turn is half exposed. Worth Lucas's eye: it can be closed with "you can't use it in a turn you used Smite" (a conditional; the budget for a Passive allows none).
- **It keeps an unused AP's worth:** he no longer needs to hold an AP back for a second Reaction, so that AP is free for an Art or becomes Guard.
- **Rules it touches:** a second Reaction AP is new (Chapter 2 gives one). The card says what it pays for. Staggered still stops all his Reactions; Slowed and Dazed never touch Reaction AP.
- **Siblings:** none in our game yet; a Talent idea logged on 2026-11-12 was "a Reaction AP from the first moment".
- **Complexity:** two short sentences, 22 words.
- **Table feel:** "I still have one" on the second attack of the round. The GM feels the wall thicken as the fight goes on, which is what Escalation is for.

**For Lucas to choose:** this, or a smaller version ("your [Divine] Reactions reach 2 squares farther"); whether Smite's turn should lose it; the name.

**Lucas's answer (2026-11-15): "Interesting mechanic, proposed. No need to make smite lose it, but add a note about it just in case."**

**The note, to watch in playtest:** with Tireless Vigil, a Paladin at Escalation 4 or more who spends his Reaction AP on Smite still has the Vigil's Reaction AP for a [Divine] Reaction that round. Smite's cost ("until his next turn he can't protect anyone") is then half paid. If Smite turns out too safe late in a fight, the fix is one clause on Tireless Vigil: "you don't gain it on a turn you used Smite".

## Decision 15: Reckoning, at Escalation 6 (DECIDED, Lucas, 2026-11-15: "Reckoning is good"; the final card is the 0 AP Action at the end of this section)

**His draft (2026-11-14):** "You emit Bright light in a 2 Emanation. The first time your turn begins when you have Escalation 6, enemies in the area are Pushed 2 and must make an Appeal Save: Frightened of you (2 rounds) / Frightened of you (EoT) / No effect."

**What the first analysis said (paladin-analyses.md):** exactly the kind of Escalation 6 card the research recommends, one flashy visible moment instead of a bonus nobody sees (13th Age ties its flashiest abilities to the escalation die); the Push and Frightened work together (Frightened makes every square toward him Difficult Terrain, so the push sticks); about 17 points once a fight, in the fights that reach Escalation 6 (round 6 without Momentum, round 4 with Momentum 2).

**Brought to the rules decided since:** the light left for the Arts (Lantern of Faith's Kindle); a yes-or-no Save is written "Tier 1 or 2:"; durations are EoT or rounds; a Passive has no trait, so the Save's DC is written.

> **Reckoning** · Paladin Escalation Passive · Escalation 6
> *Your god's light breaks from you all at once, and your foes are thrown back from it.*
> The first time in an encounter that your turn starts while your Escalation is 6, each enemy within 2 squares of you is Pushed 2 and makes an Appeal Save (DC 11 + your Power Modifier). **Tier 1 or 2:** Frightened of you (1 round).

```
Pushed 2, about 2 enemies within 2 squares .............. 12   [judgment: 6 each, below Lucas's Slid 2 (11): a Push can't curve]
Frightened of you (1 round) on about 78% of them ........ about 6   [SIM: Frightened (EoT) 2 to 4 a landing, a round a little more; the odds computed]
--- About 18, once, in the fights that reach Escalation 6: over the 1 to 3 turns left, about 6 to 9 a turn in those fights; near 0 across all fights
```

**Analysis.**
- **It is a moment, not a bonus:** the charter's rule for this rung. The table sees it coming on the Escalation counter and knows the round.
- **The decision it gives:** where to stand when it goes off. He chooses each destination (a Push's origin does), so walls mean Collision, and a pushed, Frightened enemy pays double to come back at him. It is the surrounded front-liner's breath.
- **The risk it had and still has:** pushing enemies away from him can push them toward the back line. Frightened of him covers that only for squares that bring them closer to him.
- **With the class as it is now:** an enemy thrown 2 squares and then moving off is "moving away from him" within 3 squares: Rebuke. And his turn has just started: Binding Light, or a full Smite at 4 dice, on whichever is left standing near.
- **The rung:** rare. A first fight seldom reaches round 6; with Momentum 2 it is round 4. That is what Lucas chose for the level 3 Passive (2026-11-12).
- **Complexity:** 39 words, one condition, a Save: over a Passive's 30, on the rarest card of Stage 0, where the charter puts the complexity.
- **Changed from his draft:** one duration for Frightened (1 round on a Tier 1 or 2) in the place of two (2 rounds / EoT); no light.

**For Lucas to choose:** keep his two durations (Tier 1: 2 rounds; Tier 2: EoT) or the single one; the light back in or not; 2 squares.

**Lucas (2026-11-15), before answering:** (1) should DCs be named (Power DC, Weapon DC, Body DC), so a card says "Appeal Save vs your Power DC", and Talents can later raise a DC and not a Modifier? "Unless that would be bad for the system, or disruptive... Search about it." (2) Even without it, the card needn't write "DC 11 + your Power Modifier": give it the Power trait.

**(2) Done:** Reckoning carries [Power, Save]; Chapter 1's Save Action rule then sets the DC.

**(1) Claude's answer (research saved in `book/research/save-dcs.md`): yes, with one guardrail.**
- **It is common practice** (5e's spell save DC, Pathfinder 2e's class DC and spell DC are numbers on the sheet that cards point to).
- **What goes wrong elsewhere is two DCs that overlap:** Pathfinder 2e's forums ask which of class DC and spell DC an ability uses. So: a named DC only where it is one Modifier the character already has. **Power DC = 11 + the Power Modifier; Weapon DC = 11 + the Weapon Modifier; Signature DC = the higher; an Attribute's DC = 11 + ⌈Attribute ÷ 2⌉ + 1.** Never a "class DC" beside them.
- **Why it helps:** today the DC is read from the card's traits and computed at the table ("11 + ..."), and the same sum is computed again for the Immobilized DC and inside Ward Defense. A name removes the sum, makes the card say what it means, and gives Talents something to point at.
- **The caution:** +1 on a Modifier is "a full step of difficulty" (Lucas, 2026-11-12); a Talent with +1 to a DC is that strong on every Save he forces. 5e hands DC bonuses out very sparingly. Possible, and rare.
- **Disruptive? No:** four cards are Save Actions today. The places: Chapter 1 (Saves, Save Actions), Chapter 5 (beside the Modifiers), Chapter 8 (the Immobilized DC becomes "the DC of the Action that caused it"), the Glossary, the sheet in Foundry.
- **On cards:** the traits stay the default (a [Power, Save] Action is against his Power DC, with nothing more written); a card with no such trait writes "vs your Power DC".

> **Reckoning** · Paladin Escalation Passive · Escalation 6 · [Power, Save]
> *Your god's light breaks from you all at once, and your foes are thrown back from it.*
> The first time in an encounter that your turn starts while your Escalation is 6, each enemy within 2 squares of you is Pushed 2 and makes an Appeal Save. **Tier 1 or 2:** Frightened of you (1 round).

**Lucas's answer (2026-11-15):** named DCs: yes (decided; in the rules backlog). **Reckoning: add "Setup: You Advance"**, "because if something happened between your turns and you dont have enemies adjacent anymore, it is wasted". **A rule for Setup: if an Action in your Setup is disrupted, the rest of the Action still happens.** **And: Escalation abilities are Passives, while most rules speak of Actions:** either a rule that Passives use the Actions' rules, "or we change the passives so this rule note isn't necessary".

**Claude's answer on the last point: change the card, no rule note.** The book already has the tool: Chapter 2, "An Action with an **Escalation** line on its card needs that much Escalation" (it is how the Apex is written). A "moment" ability that has a Setup, traits, an Area and a Save **is** an Action; so Reckoning is written as one: 0 AP, Encounter, Escalation 6. Every rule it needs (Setup, Targets, Save Actions, Areas, 0 AP Actions) then applies as written. A Passive stays what the word says: a standing sentence that needs no Action rule (Armor of Faith, Roving Judgment, Weight of Judgment, Tireless Vigil are all that kind). **For the level list:** the rung gives "an Escalation ability", which is a Passive or a 0 AP Action with an Escalation line.

**What changes for the player:** he uses it on his turn when he chooses (it is no longer automatic at the start of the turn), which also answers the "wasted" worry by itself; the Setup's Advance, kept as Lucas asked, is a free move to get among them first.

> **Reckoning** · Paladin Escalation Action · Escalation 6 · Encounter · 0 AP · [Area, Divine, Power, Save, Self] · Area: 2 Emanation · Appeal Save
> *You stride among your foes, and your god's light breaks from you and throws them back.*
> **Setup:** You Advance.
> Each enemy in the Area is Pushed 2.
> **Tier 1 or 2:** Frightened of you (1 round).

```
A free Advance, up to his Speed ........................... 12 to 25   [an AP: 12 unused (SIM) to 25 spent]
Pushed 2, about 2 or 3 enemies (he now picks the place) ... 12 to 18   [judgment: 6 each]
Frightened of you (1 round) on about 78% of them .......... about 6 to 9   [SIM: Frightened 2 to 4 a landing; the odds computed]
--- About 30 to 50, once, for 0 AP, in the fights that reach Escalation 6: an Encounter Action's worth, given by the clock
```

- **By the new Effects rule:** the Push is the Action's Effect (it happens whatever the Save), and the Tier line holds what depends on the Save.
- **[Area] and [Self]:** a 2 Emanation centered on him; Chapter 1's Save Action rules apply (each enemy rolls; Cover gives it Field Boons on the Save).
- **Bigger than the Passive was:** he chooses the moment and gets a free move. It is still the rarest card of Stage 0.

**Lucas's answer (2026-11-15):** Reckoning is good. **The Setup rules change:** remove "you must select the targets before the Setup" as a general rule: Lay On Hands says "toward the target" and so names it; Reckoning doesn't, and keeps its targets for after the move. And the disrupted-Setup rule grows: "If an Action in your Setup is disrupted, the rest of the Action still happens. You can change the target if Setup required a target before hand, but only if the Action was Disrupted; For example, if you use Lay on Hands, you can't move towards a target then decide on your own to change it after you reach a certain spot."

**The Setup section for Chapter 2, as it now stands (decided, not applied):**
1. A Setup happens before the rest of the Action. It is optional unless it says you must.
2. The Action's Distance and its targets are checked after the Setup.
3. If the Setup names the Action's target ("toward the target"), you choose that target before the Setup, and it stays the Action's target.
4. If an Action in your Setup is disrupted, the rest of the Action still happens. Only then, if the Setup had named a target, you can choose another target for the rest of the Action.

*Example for the book:* a Paladin uses Lay On Hands on an ally 5 squares away and Advances toward him; an enemy's Reaction stops him after 2 squares. Lay On Hands still happens: he can touch another ally within his Reach from where he stands. Had nothing stopped him, he couldn't have walked toward one ally and then touched a different one.

## Decision 16: the second Escalation 6 ability, Hallowed Stance (DECIDED, Lucas, 2026-11-15: his wording, option A; the card at the end of this section)

**His draft:** "You add your Power Modifier to damage on your Divine Actions, and all your Divine Actions gain: 'Setup: You Advance 3.'"

**What the first analysis said:** the free Advance 3 is the whole card (a move bundled into an Action is strong because it saves the move's AP: Pathfinder 2e's Sudden Charge, 4e's Nimble Strike; and with the Advance in one piece it is a second movement); the damage half is clutter; "all your Divine Actions" includes the Reactions, which moves him on an enemy's turn toward the ally being hit: "a very strong bodyguard move".

**Brought to the rules decided since:**
- **The damage bonus goes:** a silent plus (the charter's rule on Passives), worth about 1 a turn.
- **"All your Divine Actions" can't stay:** Judge is [Divine], has no Frequency, and with Roving Judgment costs 0 AP: every use would be a free Advance 3. So: once on each turn.
- **It stays a Passive:** a standing sentence that gives a Setup to Actions he already has; the Setup's own rules do the rest.

> **Hallowed Stance** · Paladin Escalation Passive · Escalation 6
> *Your god's light carries you: wherever you are needed, you are already there.*
> While your Escalation is 6, once on each turn, a [Divine] Action you use gains "Setup: You Advance 3."

```
On his own turn: an Advance 3 before one [Divine] Action ............ about 10   [the earlier analysis: 8 to 15; an AP saved on the turns he had to move]
On an enemy's turn: an Advance 3 before Shield of Faith or Rebuke ... about 10 each time, in about half the rounds (two Reactions a round with Tireless Vigil)   [judgment]
--- About 15 to 20 a round while his Escalation is 6: the last one to three turns of the long fights
```

**Analysis.**
- **The decision it gives:** where to be, every turn, his and theirs. On his turn it is a move, Smite or Binding Light, and still 2 AP. On an enemy's turn, Shield of Faith comes with 3 squares toward the ally: his body ends up between.
- **"Once on each turn"** is the Turn Frequency's own wording (once on his turn, once on each other creature's turn), so the bodyguard move stays and the Judge loop is closed.
- **With cards that have their own Setup** (Lay On Hands, Reckoning): they gain a second one; he can use both, in the order he likes. Worth Lucas's eye.
- **A Reaction's Setup is a real Advance** on someone else's turn: an enemy's movement Reaction can answer it; Rebuke's "within 3 squares" is checked after he has moved (the Distance is measured after the Setup).
- **Against Reckoning:** Reckoning is one big moment; this is three squares on every turn until the fight ends. Two different level 3 characters.
- **The rung:** the same as Reckoning's: rare.
- **Complexity:** one sentence, 20 words.
- **Table feel:** the Paladin's token moves on the GM's turn. Players love that; a GM may find "he was 5 squares away" hard to plan around, at the one rung where the fight is almost over.

**For Lucas to choose:** once on each turn, or only on his own turn, or only on Reactions; 3 squares; whether an Action with its own Setup gets both.

**Lucas's version (2026-11-15):** "While your Escalation is 6, once on your turn, any [Divine] Action you use gains 'Setup: You Advance 3.' If the [Divine] Action already has Advance as a Setup, you increase it by 3, up to your Speed." With two rules: (a) does the Advance rule say that a move given by an Action can't pass your Speed? If not, add it. (b) **Setups can't stack:** when something gives a Setup to an Action that already has one, the creature chooses to replace the original Setup or keep it; they don't combine unless a card says so, as Hallowed Stance does.

**From the rules:**
- **(a) is already written** (Chapter 3, Movement): "each time you move with an Action, you can't move more than your current Speed, unless an ability says otherwise: with Speed 2, an Action that lets you Evade 3 lets you Evade only 2." Nothing to add; the card needn't repeat "up to your Speed".
- **(b) is logged** as the fifth line of the Setup section.
- **"Once on your turn"** (his turn only): the bodyguard move on an enemy's turn is out, by his choice.

**A problem Claude found with the "increase it by 3" clause: with that same Speed rule it does almost nothing.** A Paladin's Speed is his species' (the class gives +0): Human 5, Dwarf 4, Elf 6. Lay On Hands' Setup is "Advance up to 5 squares": 5 + 3 = 8, cut back to 5 for a Human (no gain), to 4 for a Dwarf (Lay On Hands itself is already cut to 4), to 6 for an Elf (1 square gained). Reckoning's Setup is "You Advance", already his whole Speed: no gain for anyone. Two ways out, for Lucas:
- **A (Claude's lean): drop the exception.** Setups never combine. Hallowed Stance gives its Advance 3 to the [Divine] Actions that have no Setup (Smite, Binding Light, Judge, Lantern of Faith, Commandment); on Lay On Hands and Reckoning he keeps the card's own Setup, which is the better one. One sentence, no special case.
- **B: let the increase pass his Speed** ("this movement can exceed your Speed"): Lay On Hands reaches 8 squares, Reckoning his Speed + 3. A real gain, and a second place in the book where a move passes Speed.

**The card under A:**

> **Hallowed Stance** · Paladin Escalation Passive · Escalation 6
> *Your god's light carries you: wherever you are needed, you are already there.*
> While your Escalation is 6, once on your turn, a [Divine] Action you use gains "Setup: You Advance 3."

**Lucas's answer (2026-11-15): "Lets do A."** No special clause: Setups never combine.

> **Hallowed Stance** · Paladin Escalation Passive · Escalation 6
> *Your god's light carries you: wherever you are needed, you are already there.*
> While your Escalation is 6, once on your turn, a [Divine] Action you use gains "Setup: You Advance 3."

## The Escalation abilities: all six decided

| Rung (level) | Ability 1 | Ability 2 |
|---|---|---|
| Escalation 2 (level 1) | **Armor of Faith**: when you use a [Divine] Reaction, Guard 1 + Power Modifier | **Roving Judgment**: Judge's 1 AP use costs 0 AP |
| Escalation 4 (level 2) | **Weight of Judgment**: the Judged creature's Speed is reduced by 2 | **Tireless Vigil**: 1 more Reaction AP, for [Divine] Reactions |
| Escalation 6 (level 3) | **Reckoning** (0 AP Action, Encounter): Advance; enemies within 2 Pushed 2, Frightened on a Save | **Hallowed Stance**: once on your turn, a [Divine] Action gains "Setup: You Advance 3" |

## Decision 17: the Escalation hook (PROPOSED: keep it as it is; waiting for Lucas)

Level 2 gives the class's hook (Chapter 2: one more event that, once an encounter, raises his Escalation by 1). Today's:

> **Kindled Wrath** · Paladin Feature
> Once an encounter, when an ally within 5 squares of you becomes Bloodied or goes Down, your Escalation increases by 1.

**Claude's proposal: keep it, word for word.** It was written before the redesign and fits it better than it fit the old class: Smite's dice are his Escalation, so when his protection fails, his blow gets bigger at once (Nimble's Vengeance paladin does the same: an ally being wounded maxes his dice); it brings Armor of Faith, Tireless Vigil and Reckoning a round closer in exactly the fights that are going badly; and it is a moment the table already watches (the GM says when a creature becomes Bloodied). Worth about one more Smite die or one earlier Passive a fight: a few points [judgment]. No Flavor line today: "*An ally's blood on the ground, and your god's anger is yours.*"

## Decision 18: the Encounter Picks (a steer on the themes first)

Level 2 gives one Encounter Pick from three. An Encounter Action is worth double its AP; it can have two riders and one conditional. Smite already is the class's burst, so these are three other moments. **Claude's three themes, from the cards the brief said work as moments and from the research:**
1. **The great shield** (Bulwark of Faith today: an Interrupt; an ally would take damage: before it, Guard equal to what one of its Rally Points heals; after it, Slid 1). The big version of "Guard before the hit", once a fight.
2. **Holy ground** (Consecrated Ground and Beacon today): a Zone he plants for a few rounds, where the line holds. The burst as an area that stays, as Draw Steel's Censor has at his top end.
3. **The word against the Profane** (Word of Radiance today; 4e's Turn Undead): an area that throws enemies back, and does more to the Profane.

**Lucas's answer (2026-11-15):** the three themes are good, in that order. **The hook: he is thinking of removing the range**, so it counts even if the ally is far. "Which we can get into an ambiguity problem: if the ally is behind a wall, you can still hear them, do you get Kindled Wrath? Because you don't have LoS. LoS says about targeting, but what about effects that just happen?"

**From the rules:** Line of Effect (Chapter 3) is written for two things only: targeting a creature with an Action, and an area reaching a creature. Nothing covers an effect that just reads what happens. The nearest text is Chapter 4: "Every creature knows whether a creature it perceives is Bloodied or Strained". So he has found a real gap.

**Claude's proposal: one general rule, and the card needs no range.**
> **What an effect needs.** Targeting a creature needs Line of Effect. An effect that only reads something that happens ("when an ally becomes Bloodied", "when your Marked Quarry goes Down") needs only what it says: if it gives no distance and doesn't say you must see or perceive the creature, it happens wherever that creature is in the encounter.

- **Why "needs only what it says" over "you must perceive it":** perception would give the wall case an answer too (you hear a creature in a fight within 10 squares, through walls: Hidden is perceiving), but then every trigger carries a hidden check (how far, is it making noise, did it Hide). "It says what it needs" is one sentence and never asks the table to measure anything the card didn't mention. A card that should need sight says "that you can see"; one that should need range gives a distance.
- **Kindled Wrath with it:** "Once an encounter, when an ally becomes Bloodied or goes Down, your Escalation increases by 1." Behind a wall, across the map: yes. Divine, and simple.
- **The Archer's hook** ("your Marked Quarry goes Down") is already written with no range: the same rule covers it.
- **Our two Reactions get a Target line, for the same reason** (Lucas's own convention from the earlier card sessions: "Targets the triggering creature, no Distance: the Interrupt says it"): Shield of Faith and Rebuke target **the triggering creature** (the enemy), so he needs Line of Effect to the enemy; the ally can be behind a pillar.

> **Kindled Wrath** · Paladin Feature · level 2
> *An ally's blood on the ground, and your god's anger is yours.*
> Once an encounter, when an ally becomes Bloodied or goes Down, your Escalation increases by 1.

## Decision 19: the first Encounter Pick, the great shield (PROPOSED: Bulwark of Faith kept; waiting for Lucas)

**Rules and research first.** Today's card was written with Lucas (2026-11-06) and is Mithril. Guard: taken before Health, doesn't stack, ends with the encounter; a Rally Point heals a quarter of the Health Pool (8 for an Archer, 9 for a Paladin), and this card reads that number without spending the point. Research: the three tested shapes of protection are shave it, halve it, take all of it, each once a round or once a fight; the martyr-style power is the one players praise by name (the Cavalier's Righteous Shield); protection that states a number and moves a token is the kind that is seen (Draw Steel's Parry). Lucas's direction: Guard before the hit. An Encounter Action is priced at double its AP (a 1R one: 50).

> **Bulwark of Faith** · Paladin Encounter Action · 1R · Encounter · [Divine, Focus] · Target: the triggering creature
> *You step into the blow meant for them, and your god holds the line with you.*
> **Interrupt:** A [Strike] Action would damage an ally within 5 squares.
> The ally gains Guard equal to what one of their Rally Points heals, before the damage. After the damage, they are Slid 1.

(Today's text, with "the target" made "the ally" for clarity: the Target line names the attacker, as on his other Reactions.)

```
Guard 8 or 9, on the ally being hit .......... 54 at 6 a point [SIM] to 72 at 8 a point [the forums' rate for an ally about to be hit]
   what a Standard's hit leaves of it stays as Guard for the next one
Slid 1, after the damage ..................... 5   [Lucas's rate]
--- Total: about 59 to 77, of 50: a little over, once an encounter (about +3 to +8 a turn over its price across a fight)
```

**Analysis.**
- **Keep it word for word.** It is already the big version of the class's support direction, it reads a number the ally has on its sheet, and the Slide moves a token on the GM's turn.
- **The decision it gives:** which hit of the fight. A Standard's Special (8 + 1d8 on a Tier 3) or an Elite's is the one; spent on a small hit, most of the Guard still stays on the ally.
- **With the new class:** it is a [Divine] Reaction, so Armor of Faith gives him Guard 3 when he uses it, and Tireless Vigil can pay for it. With Shield of Faith on the same Strike? No: one Reaction to the same Action (Chapter 2).
- **Guard, not healing, and none of the ally's Rally Points spent:** inside "Rally Points for allies, not too much".
- **The Slide** is a Forced Movement he aims: the ally ends out of the attacker's Reach, or behind him. (Lucas, 2026-11-15: moving an ally is fine for the Paladin, if more a commander's tool.)
- **Over its price by 10 to 25:** an Encounter Pick is where the class's level 2 growth is; if it must come down, the Slide is the part to drop.
- **Mithril:** unchanged text keeps it Mithril; the clarity word ("the ally") would make it Diamond when applied.

**For Lucas to choose:** keep it; or widen the trigger to any damage (areas, Saves), which makes it the answer to a dragon's breath on one ally.

**Lucas's answer (2026-11-15), on the rule for effects that just happen:** good, "but I think perceiving should be the default, to make Hide a bit more worth it or risky (for allies)". And the line "an effect that only reads something that happens" is confusing: "people can think: 'Well, a Reaction is an effect that only reads something that happens.' Then think that Rebuke can work through walls and such. This was a big deal about Champion's reactions in 2e."

**The rule, rewritten (perceiving is the default; the Reaction case is said outright):**

> **Answering a moment.** A Reaction's Interrupt or Trigger, and a feature that says "when...", wait for a **moment**. To answer a moment you must **perceive** every creature it names (Hidden is enough; Unsensed is not), unless the card says otherwise.
> **Then the card does something.** Whatever it does to a creature **targets** that creature, and targeting needs Line of Effect as always. A Reaction never reaches through a wall you have no Line of Effect past.

- **Rebuke through a wall: no.** It targets the triggering creature, so he needs Line of Effect to the enemy. The same for Shield of Faith and Bulwark of Faith (the Target line names the attacker).
- **The ally in the moment** must be perceived: seen, or heard (a creature in a fight within 10 squares, through walls). An ally who has Hidden from everyone, his own side included, can't be answered for: Lucas's "risky for allies".
- **Kindled Wrath** (no target, only a moment): he must perceive the ally who becomes Bloodied or goes Down. In sight at any distance, or within hearing.
- "Moment" is already the book's word (Chapter 2: "An Interrupt or a Trigger names a moment the rules define"); the rule only adds what answering one needs.

**His question: should it be "Interrupt: A [Strike] Action damages an ally", since Interrupt already means "before"? Claude's answer: keep "would".** Chapter 2 writes every Interrupt that way ("A creature would Advance", "would leave a square", "would damage someone") and every Trigger in the present ("makes a [Strike] Action", "goes Down"). The word says the thing hasn't happened yet even to a reader who skips the label; "Interrupt: ... damages an ally" reads as if the damage were done. For damage it also places the moment exactly: the Strike has rolled, the damage is known and not yet applied.

**Bulwark of Faith:** no objection raised; taken as decided (kept as it is) unless he says otherwise.

**Lucas (2026-11-15): "All good, next", and: put examples on "Then the card does something", Kindled Wrath as one and a Reaction as another.**

**The rule with its examples (for Chapter 2):**

> **Answering a moment.** A Reaction's Interrupt or Trigger, and a feature that says "when...", wait for a **moment**. To answer a moment you must **perceive** every creature it names (Hidden is enough; Unsensed is not), unless the card says otherwise.
> **Then the card does something.** Whatever it does to a creature **targets** that creature, and targeting needs Line of Effect as always. A Reaction never reaches through a wall you have no Line of Effect past.
>
> *Example 1 (a moment and nothing else).* Kindled Wrath: "when an ally becomes Bloodied or goes Down, your Escalation increases by 1." Sam, a Paladin, hears his ally Nari fighting behind a wall, 6 squares away, when Nari becomes Bloodied. Sam perceives him (Hidden is enough), and Kindled Wrath does nothing to any creature but Sam: his Escalation increases. Had Nari been 12 squares away behind that wall, out of sight and out of hearing, it wouldn't.
> *Example 2 (a moment, then a target).* Rebuke: "an enemy within 3 squares of you moves away from you"; its Target is the triggering creature. A goblin 2 squares from Sam, on the other side of a wall, runs off. Sam hears it, so the moment is his to answer; but Rebuke targets the goblin, and Sam has no Line of Effect to it: he can't use Rebuke.
> *Example 3 (two creatures in the moment).* Shield of Faith: "an enemy's [Strike] Action would damage an ally within 5 squares of you"; its Target is the triggering creature. An orc Sam can see strikes Nari, who stands behind a pillar 4 squares from Sam. Sam perceives both, and has Line of Effect to the orc: he uses Shield of Faith, and Nari's damage is reduced. He needs no Line of Effect to Nari.

(Names from the book's list; to check against the names already used when it is applied.)

## Decision 20: the second Encounter Pick, holy ground (PROPOSED, waiting for Lucas)

**Rules and research first.** A lasting area is written "for N rounds" (rounds count at the end of his turn); a 2 Emanation is 21 squares, placed up to its Distance away, and it doesn't move (an Aura would follow him). Difficult Terrain doubles a square's cost; Hazardous Terrain ([HT]) is only for areas that harm. Guard doesn't stack (the higher value). Today's two cards on this theme: Consecrated Ground (a Daily: for 3 rounds enemies in a 2 Emanation take 1 Bane, allies heal 1d4 at the start of their turns) and Beacon (Aura 2: +1 Defense). The SIM on areas: "a Zone works only for who stays in it" (the Paladins walked out of their own); holding the line with the Area cards was the best result measured (the deadly fight in the long hall won 88% against 70%). Research: the burst can be an area that stays (the Censor's Edicts); a front line is real where passing costs movement; flat Defense auras are forgotten; healing each turn is the healer's engine Lucas doesn't want here. An Encounter Action is worth double its AP (2 AP: 100) and may have two riders.

> **Consecrated Ground** · Paladin Encounter Action · Encounter · 2 AP · [Area, Divine] · Distance: 5 sq. · Area: 2 Emanation
> *You drive your weapon into the earth and the ground around it shines: your foes wade through it, and your allies stand firmer on it.*
> For 3 rounds, the Area is Difficult Terrain for enemies, and when you or an ally start your turn in it, you gain Guard equal to your Power Modifier.

```
Difficult Terrain for enemies over 21 squares, 3 rounds ... not priced (the SIM has never measured it; suggested 5 to 10 a round where enemies must cross it: 15 to 30)
Guard 2 at the start of each turn in it: about 3 creatures x 3 rounds, less the turns spent outside (about 70% in) ... 12 x 6.3 = about 76   [SIM: 6 a point of Guard]
--- Total: about 90 to 105, of 100: on
```

**Analysis.**
- **The decision it gives:** where the fight will be. He picks the 21 squares (a doorway, the ground in front of the Archers) and the party decides to hold them. The SIM's warning is the card's whole skill: it is worth nothing to who walks out.
- **Both halves are the class:** the ground slows who tries to pass (the line), and the Guard is "before the hit" (his support), renewed each turn so a spent Guard comes back. Guard 2 doesn't stack with Lay On Hands' 4: the higher stays.
- **No healing and no Bane:** the old heal each turn was an engine; the Bane on everything was the silent kind. Guard at the start of a turn is said aloud once a turn.
- **With the rest:** Binding Light and Rebuke keep an enemy inside or outside it; Hold the Line's Brace adds nothing in it (already Difficult Terrain); Trade Places and Rescue move allies onto it.
- **Rules it touches:** nothing new: a lasting Area, Difficult Terrain "for enemies" (as Brace), Guard. It is not Hazardous Terrain (it harms nobody). Foundry already places Zones with "what it does inside" rows (the old Consecrated Ground used one); a Zone that is Difficult Terrain for one side only: not tried.
- **Siblings:** today's Consecrated Ground (the same name, a Daily) and Beacon are replaced by it.
- **Complexity:** one Version, 31 words, two riders' worth (terrain, Guard), no conditional.
- **Table feel:** a shining patch on the map that everybody plays around for three rounds. The risk: bookkeeping at each start of turn (who is inside); Foundry's Zone can do it.

**For Lucas to choose:** a fixed Area (this) or an Aura that follows him; Guard equal to his Power Modifier (2) or 1 + it (3: about 135 points, over); 3 rounds; Distance 5.

**Lucas's answer (2026-11-15): a fixed Area; Guard equal to his Power Modifier; 3 rounds; Distance 8 sq.; and the sentence was confusing ("you gain": the Paladin, or whoever is in it?).** Rewritten so the creature that gains the Guard is named. DECIDED:

> **Consecrated Ground** · Paladin Encounter Action · Encounter · 2 AP · [Area, Divine] · Distance: 8 sq. · Area: 2 Emanation
> *You drive your weapon into the earth and the ground around it shines: your foes wade through it, and your allies stand firmer on it.*
> For 3 rounds, the Area is Difficult Terrain for enemies. Whenever you or an ally starts a turn in the Area, that creature gains Guard equal to your Power Modifier.

**He asked: what is 1 point of damage worth in an area?** One expected point of damage on one creature is about 3.4 points (a Weapon Attack: 7.34 damage on average = 25). In an Area it is multiplied by the creatures in it (the ruler assumes 1.8 for a 2 Emanation or Burst used once). In a lasting Area, "1 damage at the start of an enemy's turn in it" for 3 rounds: about 2 enemies x 3 rounds x half the turns still inside = 3 damage = about 10 points; 20 if nobody leaves. Cheap, because enemies walk out (and it would make the ground Hazardous Terrain, [HT: Turn]). The Guard line is worth more (76) because allies choose to stay.

## Decision 21: the third Encounter Pick, the word against the Profane (PROPOSED, waiting for Lucas)

**Rules and research first.** Today's Word of Radiance: Encounter, 2 or 3 AP, a 2 / 3 Burst within 10 squares, a [Power] Strike against Will Defense, [R] 1d10 / 2d8 / 3d6 Ho, Pushed 1 / 2, Prone on a Critical. 4e's Turn Undead (read): a burst from the cleric that damages, pushes and immobilizes undead only; the research's lesson is "it always works, and a little more against the Profane". Smite already says how: its dice are d8s against a Profane creature, and the creature he Judged is one. Reckoning (Escalation 6) is already a 2 Emanation from him that Pushes 2 and Frightens: this card must not be a second one. A Save's odds for a Standard enemy: Tier 1 / 2 / 3 = 28 / 51 / 22%.

> **Word of Radiance** · Paladin Encounter Action · Encounter · 2 AP · [Area, Divine, Power, Save, Self] · Area: 2 Emanation · Each enemy in the Area · Appeal Save
> *You speak a single word of your god, and light bursts from you: your foes burn in it and stagger back.*
> Radiance dice are [R] d6 Ho; against a Profane creature they are d8s.
> Tier 1: 3 Radiance dice; Pushed 2.
> Tier 2: 2 Radiance dice; Pushed 1.
> Tier 3: 1 Radiance die.

```
Damage: 3 / 2 / 1 d6 at 28 / 51 / 22% = 7.3 a creature; 2.3 creatures (he stands in front) = 16.8 ... 57   [SIM: 3.4 a point of damage; the count is judgment, the ruler assumes 1.8]
Pushed 2 or 1 on 79% of them ... not priced (positions are the ruler's blind spot; suggested 5 a creature: about 12)
d8s against a Profane creature: about +2 on the one he Judged ... 7   [judgment]
--- Total: about 75 to 80, of 100: a little under
```

**Analysis.**
- **The decision it gives:** when he is surrounded. It is the only damage he deals to more than one creature, and it clears the squares around him: the turn after, the enemies must cross them again (through Brace or Consecrated Ground if he has them).
- **Not a second Reckoning:** Reckoning has no damage and Frightens; this one burns and has no condition. Both push from him; at Escalation 6 he can do both in a turn, on purpose (his "explode").
- **Not a second Smite:** the damage is spread (7 a creature), never 30 on one. "Not a consistent damage dealer" holds: once an encounter.
- **Against the Profane, the Smite way:** the same sentence as Smite (d8s), so the class has one pattern, and Judge makes it work in every campaign.
- **Always something:** Tier 3 still deals 1 die, as today's card does on its Tier 1.
- **A little under its price on purpose:** it hits every enemy around him with no roll of his to fail, and the Push isn't priced. If it plays weak: 4 / 3 / 1 dice (about 100).
- **Rules it touches:** none new. Pushed is from the Area's origin (him). [Self] as on Reckoning.
- **What changed from today's card:** an Emanation from him instead of a Burst 10 squares away (he stays in front; a far Burst is a caster's), a Save instead of his roll (many targets, one result each), one Version instead of two, no Prone on a Critical.
- **Other riders the Profane could get instead of d8s:** Dazed 1 (loses 1 AP: strong, about 10 a creature), Immobilized (Binding Light has it), Frightened (Reckoning has it), 1 more square of Push.
- **Complexity:** one Version, about 30 words, one rider (the Push), one conditional (Profane).

**For Lucas to choose:** the shape (from him, or today's Burst at a distance); the dice (3 / 2 / 1, or 4 / 3 / 1); the Profane line (d8s, or one of the others).

**Lucas's answer (2026-11-15): the card was "written weirdly".** The Profane line is one plain sentence ("The damage die size is increased to d8s against Profane creatures"), the Tiers are written normally (the dice in full, no "Radiance dice"), the Targets line is on the card, and the Push is 1 more on every Tier, Tier 3 included. DECIDED:

> **Word of Radiance** · Paladin Encounter Action · Encounter · 2 AP · [Area, Divine, Power, Save, Self] · Area: 2 Emanation · Target: All enemies in the Area · Appeal Save
> *You speak a single word of your god, and light bursts from you: your foes burn in it and stagger back.*
> Against a Profane creature, the damage dice are d8s.
> Tier 1: [R] 3d6 Ho; Pushed 3.
> Tier 2: [R] 2d6 Ho; Pushed 2.
> Tier 3: [R] 1d6 Ho; Pushed 1.

Price: the damage 57 and the Profane dice 7 as before; the Push, now on every creature and 1 longer, still not priced (my guess about 18): about 80 to 85, of 100. **Lesson for the next cards (mine):** a named die ("Smite dice") is for a card whose count changes (Smite: one for each Escalation); a card with fixed dice writes them on its Tiers. The header's order: traits, Distance, Area, Target, the Save.

**The Paladin's levels 1 to 3 are all decided.** Nothing is in the book, the card JSON or Foundry.

## The whole Paladin, levels 1 to 3: the clean read (2026-11-15, before applying)

Every card in its final text, in the order a character gains them. **Numbers:** Weapon +1 · Power +2 (fixed) · Health 20 / 10 · Rally 6 · Speed +0 · Heavy armor · Attributes unchanged.

### Level 1: the two Features (every Paladin has them)

> **Judge** · Paladin Feature · At-will · [Divine] · Distance: 10 sq. · Target: One enemy you can see
> *You pronounce a foe guilty before your god, and holy light dulls its blows against those who stand near you.*
> **0 AP:** At the start of an encounter, or as a 0R when the creature you Judged goes Down: the target is Judged by you until the encounter ends.
> **1 AP:** The target is Judged by you instead of the one you had.
> A creature stops being Judged when it goes Down. A creature Judged by you counts as Profane for you. The first time each round it damages an ally within 5 squares of you, that damage is reduced by your Power Modifier.

> **Smite** · Paladin Feature · Encounter · 2 AP · [Divine, Signature, Strike, Weapon] · Distance: Weapon · Target: One creature
> *Holy light gathers on your weapon as the fight wears on, and you bring all of it down in one blow.*
> **Smite dice:** [R] 1d6! Ho for each Escalation you have, up to 4 dice. Against a Profane creature they are 1d8!s.
> **Tier 1:** Your Smite dice.
> **Tier 2:** [V] 1[W] + [Mod] + your Smite dice.
> **Tier 3:** [V] 1[W] + [Mod] + your Smite dice + 1 more Smite die.
> When you use Smite, you can spend your Reaction AP to roll 1 more Smite die. Neither extra die counts toward the 4.

### Level 1: a Hallmark Action (1 of 2)

> **Binding Light** · Paladin Hallmark Action · Round · 2 AP · [Divine, Strike, Weapon] · Distance: Weapon · Target: One creature
> *Your blow lands wreathed in light that roots your foe where it stands.*
> **Tier 1:** [R] 1d6 Ho.
> **Tier 2:** [V] 1[W] + [Mod] + [R] 1d6 Ho; Immobilized (1 round).
> **Tier 3:** [V] 1[W] + [Mod] + [R] 1d8 Ho; Immobilized (1 round).

> **Lay On Hands** · Paladin Hallmark Action · Round · [Divine, Focus] · Distance: Reach · Target: One willing ally
> *You stride to an ally's side and lay a hand on them, and a skin of pale light settles over them.*
> **Setup:** You Advance up to 5 squares in a straight line toward the target.
> **1 AP:** The target gains Guard equal to 2 + your Power Modifier.
> **2 AP:** The target gains Guard equal to 2 + your Power Modifier and can use 1 Rally Point.

### Level 1: a Hallmark Reaction (1 of 2)

> **Shield of Faith** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus] · Target: The triggering creature
> *You raise a hand, and a pane of light turns part of the blow aside and pulls your foe's eye to you.*
> **Interrupt:** An enemy's [Strike] Action would damage an ally within 5 squares of you.
> That damage is reduced by 1 + your Power Modifier, and the enemy is Taunted by you (1 round).

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Power, Save] · Target: The triggering creature · Appeal Save
> *You call out in your god's name, and your foe's stride falters and stops.*
> **Trigger:** An enemy within 3 squares of you moves away from you.
> The enemy is Hindered (EoT) and makes an Appeal Save.
> **Tier 1 or 2:** Its Move Action is disrupted.

### Level 1: an Art (1 of 3; a second at level 3)

> **Lantern of Faith** · Paladin Art · Round · 1 AP · [Divine]
> *You call your god's light: around you, onto a foe, or into a foe's eyes.*
> **Kindle:** You shed Bright light 3 until the encounter ends.
> **Reveal:** One creature you perceive within 5 squares sheds Bright light 1 (1 round).
> **Glare:** [Power, Save] One enemy you can see within 5 squares makes an Instinct Save. Tier 1 or 2: Half-Blinded (EoT).

> **Hold the Line** · Paladin Art · Round · 1 AP
> *You plant yourself where the fight is worst: you crowd the ground at your feet, trade places with an ally, or carry one clear.*
> **Brace:** Squares adjacent to you are Difficult Terrain for enemies (1 round).
> **Trade Places:** You and a willing ally within Reach swap squares. Each of you is moved by a Reposition.
> **Rescue:** Reposition 2 a willing ally within Reach.

> **Commandment** · Paladin Art · Round · 1 AP · [Divine]
> *You speak with your god's authority: you call a foe to face you, steady the hearts around you, or order a foe to its knees.*
> **Challenge:** One enemy within 5 squares is Taunted by you (1 round).
> **Courage:** You and allies within 3 squares of you ignore the Frightened condition (1 round).
> **Kneel:** [Power, Save] One enemy within 5 squares makes an Appeal Save. Tier 1 or 2: Prone.

### Level 1: the Escalation 2 Passive (1 of 2)

> **Armor of Faith** · Paladin Escalation Passive · Escalation 2
> *Each time you answer for an ally, your god's light settles on you like mail.*
> While your Escalation is 2 or more, when you use a [Divine] Reaction, you gain Guard equal to 1 + your Power Modifier.

> **Roving Judgment** · Paladin Escalation Passive · Escalation 2
> *Your eye passes from one guilty foe to the next, and your god's attention follows it.*
> While your Escalation is 2 or more, the 1 AP use of Judge costs you 0 AP.

### Level 2: the hook (every Paladin has it)

> **Kindled Wrath** · Paladin Feature · Level 2
> *An ally's blood on the ground, and your god's anger is yours.*
> Once an encounter, when an ally becomes Bloodied or goes Down, your Escalation increases by 1.

### Level 2: an Encounter Pick (1 of 3)

> **Bulwark of Faith** · Paladin Encounter Action · 1R · Encounter · [Divine, Focus] · Target: The triggering creature
> *You step into the blow meant for them, and your god holds the line with you.*
> **Interrupt:** An enemy's [Strike] Action would damage an ally within 5 squares of you.
> The ally gains Guard equal to what one of their Rally Points heals, before the damage. After the damage, they are Slid 1.

> **Consecrated Ground** · Paladin Encounter Action · Encounter · 2 AP · [Area, Divine] · Distance: 8 sq. · Area: 2 Emanation
> *You drive your weapon into the earth and the ground around it shines: your foes wade through it, and your allies stand firmer on it.*
> For 3 rounds, the Area is Difficult Terrain for enemies. Whenever you or an ally starts a turn in the Area, that creature gains Guard equal to your Power Modifier.

> **Word of Radiance** · Paladin Encounter Action · Encounter · 2 AP · [Area, Divine, Power, Save, Self] · Area: 2 Emanation · Target: All enemies in the Area · Appeal Save
> *You speak a single word of your god, and light bursts from you: your foes burn in it and stagger back.*
> Against a Profane creature, the damage dice are d8s.
> **Tier 1:** [R] 3d6 Ho; Pushed 3.
> **Tier 2:** [R] 2d6 Ho; Pushed 2.
> **Tier 3:** [R] 1d6 Ho; Pushed 1.

### Level 2: the Escalation 4 Passive (1 of 2)

> **Weight of Judgment** · Paladin Escalation Passive · Escalation 4
> *Your judgment hangs on your foe like a chain, and its steps drag.*
> While your Escalation is 4 or more, a creature Judged by you has its Speed reduced by 2 (to a minimum of 1).

> **Tireless Vigil** · Paladin Escalation Passive · Escalation 4
> *The longer the fight lasts, the less escapes you: your guard is on two allies at once.*
> While your Escalation is 4 or more, you gain 1 more Reaction AP when you regain AP. It pays only for [Divine] Reactions.

### Level 3: the Escalation 6 ability (1 of 2), and a second Art

> **Reckoning** · Paladin Escalation Action · Escalation 6 · Encounter · 0 AP · [Area, Divine, Power, Save, Self] · Area: 2 Emanation · Target: All enemies in the Area · Appeal Save
> *You stride among your foes, and your god's light breaks from you and throws them back.*
> **Setup:** You Advance.
> Each target is Pushed 2.
> **Tier 1 or 2:** Frightened of you (1 round).

> **Hallowed Stance** · Paladin Escalation Passive · Escalation 6
> *Your god's light carries you: wherever you are needed, you are already there.*
> While your Escalation is 6, once on your turn, a [Divine] Action you use gains "Setup: You Advance 3."

**Fixed while compiling (drift between the turns, no decision changed):**

- **Glare:** the record's last card still said Dazzled; the condition you chose is **Half-Blinded**.
- **Headers:** one order on every card: traits, Distance, Area, Target, the Save. "Target: The triggering creature" is now written on Shield of Faith and Rebuke (decided, but missing from their headers); Reckoning gets "Target: All enemies in the Area" and "Each target is Pushed 2"; Rebuke's "Vs.: Appeal Save" is "Appeal Save" like the others.
- **Tier lines:** every one ends with a period; "Tier 1 or 2" lines sit on their own line.

**For Lucas (four small things):**

1. **Bulwark of Faith's Interrupt:** it says "A [Strike] Action would damage an ally within 5 squares." Shield of Faith says "An enemy's [Strike] Action would damage an ally within 5 squares of you." I'd make Bulwark's the same sentence. It is a Mithril card: changing it makes it Diamond.
2. **Bulwark of Faith and the moment rule:** its Target is the attacker, but everything it does is to the ally. By the moment rule he then needs Line of Effect to the ally too (the Guard and the Slide target them). I'd make its Target "The ally" so the card says so.
3. **The Profane sentence:** Smite: "Against a Profane creature they are 1d8!s." Word of Radiance: "Against a Profane creature, the damage dice are d8s." Close enough for me; say so if you want one wording.
4. **Hold the Line's Flavor:** "you foul the ground at your feet" reads odd to me. Proposed: "you crowd the ground at your feet".

**Seen together:**

- **His numbers, side by side** (Power Modifier 2): Judge reduces by 2; Shield of Faith reduces by 3; Armor of Faith gives him Guard 3; Lay On Hands gives Guard 4; Consecrated Ground gives Guard 2 a turn; Bulwark gives the ally's Rally value (8 or 9).
- **His Reaction AP has four buyers:** Shield of Faith or Rebuke, Bulwark of Faith, and Smite's extra die. Judge's re-judge is a 0R and costs nothing. Tireless Vigil adds one more for [Divine] Reactions.
- **What moves him:** Lay On Hands' Setup (5), Reckoning's Setup (his Speed), Hallowed Stance (3, once a turn). Setups don't stack: he chooses one.
- **What reads Profane:** Smite's dice and Word of Radiance's dice. Judge makes one creature Profane for him.
- **18 cards:** 2 Features, 2 Hallmark Actions, 2 Hallmark Reactions, 3 Arts, 6 Escalation abilities, 3 Encounter Actions, and the hook. A character holds 9 of them at level 3.

**Lucas's answer (2026-11-15):** 1. Bulwark's Interrupt is the same sentence as Shield of Faith's (applied above; the card will be Diamond). 2. Bulwark's Target could be "The triggering creature and the ally"; but first **check the whole targeting rule, research it, make it less confusing** ("a can of worm in almost all systems"): in progress, `book/research/` gets the note. 3. The two Profane sentences are fine. 4. "you crowd the ground at your feet" (applied above). **And: inventory every Action card element** (the redesign's, then the Core book's that are left), to build the Structure from: `book/cards/card-structure.md`.

## The targeting rule, after the research (PROPOSED 2026-11-15, waiting for Lucas)

**Rules and research first.** The book: "the effects of an Action ... affect the target of the Action" (Chapter 2, Targets of Effects) and "To target a creature with an Action, you need Line of Effect" (Chapter 3). The research folder had nothing on it; searched and saved: `book/research/targeting.md`. What it found: **the games with a Target line on every reaction (Draw Steel, 4e) have no recorded argument about it; the one with none (Pathfinder 2e's Champion) has had the same argument in 2020, 2021 and 2025.** The working pattern: one Target line, chosen by where the card's main effect lands; the Trigger is written about "the target" (Draw Steel's Parry: "Self or one ally. Trigger: A creature deals damage to the target."); the other creature gets a fixed word and is affected without being a target. No game read has our perception rule; their forums ask for it.

**What was confusing in my draft:** "whatever the card does to a creature targets that creature" made a card have hidden targets beyond its Target line (Bulwark: the attacker on the line, the ally in the text). The fix is the opposite sentence.

**The rule, rewritten:**

> **A Reaction's target.** Every Reaction has a Target line, and its Interrupt or Trigger is written about **the target**. The creature whose Action sets the Reaction off is **the triggering creature**; when the target is that creature, an ally the moment names is **the triggering ally**.
> **To use a Reaction** you need Line of Effect to its target, as for every Action, and you must perceive the target and the triggering creature (Hidden is enough; Unsensed is not).
> **Affected is not targeted.** A creature a card names by one of those words, and not on its Target line, is affected without being targeted: the card needs no Line of Effect to it.
> A feature that says "when..." has no target: you must perceive the creatures it names.

**The three Reactions under it** (the "within N squares of you" leaves the sentence and becomes the Distance line):

> **Shield of Faith** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus] · Distance: 5 sq. · Target: One ally
> **Interrupt:** An enemy's [Strike] Action would damage the target.
> That damage is reduced by 1 + your Power Modifier, and the triggering creature is Taunted by you (1 round).

> **Bulwark of Faith** · Paladin Encounter Action · 1R · Encounter · [Divine, Focus] · Distance: 5 sq. · Target: One ally
> **Interrupt:** An enemy's [Strike] Action would damage the target.
> The target gains Guard equal to what one of their Rally Points heals, before the damage. After the damage, they are Slid 1.

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Power, Save] · Distance: 3 sq. · Target: One enemy · Appeal Save
> **Trigger:** The target moves away from you.
> The target is Hindered (EoT) and makes an Appeal Save. **Tier 1 or 2:** its Move Action is disrupted.

**What changes in play.**
- Shield of Faith and Bulwark of Faith now need Line of Effect to the **ally**, not to the attacker. He must still perceive the attacker (hearing is enough). Example 3 of the moment rule turns around: with Nari behind a wall he can't shield him; with the orc behind a wall and Nari in view, he can.
- Rebuke is unchanged in play: the enemy is the target and the triggering creature.
- Kindled Wrath is unchanged: no target, he perceives the ally.
- Shield of Faith Taunts an attacker he may have no Line of Effect to. Taunted has no sight clause, so it works; to watch.

**The other two ways, and why not:**
- **"Target: The triggering creature and the ally" (Lucas's idea):** honest, but it asks Line of Effect to both, so a Paladin can't shield an ally from an archer behind an arrow slit; and every protective card would carry two targets on its line. No game read does it.
- **Keep the draft (every effect targets whoever it touches):** the hidden targets above.

**Lucas's answer (2026-11-15):** the first two sentences are clear. "an ally the moment names is the triggering ally" is confusing ("the moment names"); "Affected is not targeted ... by one of those words" he "didnt understand much at all". And he asked: "by the rules, you dont need LoS to the triggering creature unless it is the same as the target?" **Yes: Line of Effect is owed to the target only; the triggering creature must only be perceived (seen or heard).**

**The rule, second wording (PROPOSED).** "The triggering ally" is gone (no card of ours needs it; it comes back the day one does), and the third paragraph says the thing with the card that does it:

> **A Reaction's target.** Every Reaction has a Target line, and its Interrupt or Trigger is written about **the target**. The creature whose Action sets the Reaction off is **the triggering creature**.
> **To use a Reaction** you need Line of Effect to its target, as for every Action. You must also perceive the target and the triggering creature (Hidden is enough; Unsensed is not).
> **Only the Target line targets.** A Reaction can also do something to the triggering creature when it isn't the target: Shield of Faith's target is the ally, and it Taunts the attacker. You need no Line of Effect to the triggering creature for that; perceiving it is enough.
> A feature that says "when..." has no target: you must perceive the creatures it names.

**Lucas's answer (2026-11-16): "Proposed." THE TARGETING RULE IS DECIDED in its second wording,** and with it Shield of Faith, Bulwark of Faith and Rebuke as written above (Distance and "Target: One ally" / "One enemy"; the Interrupt or Trigger written about "the target").
