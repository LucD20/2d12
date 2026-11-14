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

## Decision 3: next (the second Feature)

By the charter's question 9 ("test both"), the next card is **the burst**, drafted two ways: as a Feature every Paladin has at level 1, and as the Encounter Pick moved to level 1. Lucas's draft, or Claude's proposal.
