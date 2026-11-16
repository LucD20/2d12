# The Archer's redesign: the record

**Started 2026-11-16 (Lucas: "Start the Archer"), on branch `pack-paladin-redesign`, after the Paladin was applied to the book.** The same way as the Paladin (`paladin-redesign.md`): his brief, research, then one decision at a time (the class's numbers, the two Features, the Hallmark Actions and Reactions, the three Arts, the six Escalation abilities, the hook, the three Encounter Picks), each card in the analysis format, in the card Structure (`card-structure.md`). **Nothing goes into the book, the card files or Foundry until he says so.** **The reading page:** `book/cards/archer-desk/index.html`, the artifact "Archer Redesign Desk" (updated with every decision). The cards, when applied, go to `book/cards/stage0/archer.json`.

## The brief (Lucas, 2026-11-16)

> I want to remove the quarry part of the archer. Later a ranger class will get it.
>
> Archer are a damage dealers that deals damage by hitting a lot of times, not one big hit. They are very mobile, running away or moving side to side to distract enemies. They are about shooting fast and precise, then moving away. They are fast to change to melee for a quick strike then moving back to shooting arrows. Because they are ranged, they keep on the back lines since they are fragile, and a single action of damage doesn't do lots.

(Claude's draft before it had the quarry at its center and "soft control"; both are out.)

**The brief, line by line:**

| His words | What it asks of the cards | Where today's Archer stands |
|---|---|---|
| "remove the quarry... a ranger class will get it" | no mark at all; a new identity Feature and a new Escalation hook | Marked Quarry, Mark Quarry, Thrill of the Kill, Hunter's Focus, five of the seven Passives and both Apexes are quarry cards |
| "hitting a lot of times, not one big hit" | several small hits a turn; no burst card; the class's Encounter Picks are not big shots | Marksman's Shot, Deadeye and Deathmark are big hits; Double Shot and Twin Shot fit |
| "very mobile, running away or moving side to side to distract enemies" | movement inside the Actions, and movement that does something to enemies | Rolling Shot (Evade, then shoot), Sure Step, Vanish; nothing "distracts" |
| "shooting fast and precise, then moving away" | shoot first, move after | Rolling Shot moves first |
| "fast to change to melee for a quick strike then moving back" | a weapon swap that costs nothing, a melee Strike in the kit | nothing; a bow takes two hands |
| "keep on the back lines since they are fragile" | low Health, no protection of its own but distance and movement | Health 16 / 8, Medium armor, Speed +1 |
| "a single action of damage doesn't do lots" | each hit small; the turn's total comes from the count | a Weapon Attack with a longbow is a full 1[W] + [Mod] |

**Two rules this runs into (to settle with the cards):** the At-will Banes on a turn's second and third Weapon Attack (a class of many hits lives under them), and the table's speed (rules-backlog.md "TABLE SPEED": every hit is a roll).

## Today's Archer (what is being replaced)

- **Numbers:** Attributes Body or Instinct +1, Mind or Appeal +1; Health 16 / 8; Rally 5; Speed +1; Weapon +2, Power +1; Medium armor; hook: your Marked Quarry goes Down (Thrill of the Kill).
- **Features:** Sharpshooter (3 Mastery with one Projectile weapon; it also holds the Hallmark choice), Marked Quarry (1 Boon on [Shot, Strike] Actions against it, and more), Mark Quarry (the Action: Turn, 0 / 1 AP; it has the hole Judge had: a second kill in a turn can't re-mark).
- **Hallmark Actions:** Double Shot (2 or 3 AP: two Weapon Attacks on different creatures) or Rolling Shot (1, 2 or 3 AP: Evade, then a Weapon Attack). **Hallmark Reactions:** Overwatch (a shot at an enemy that moves closer; Hindered) or Covering Shot (a shot at an attacker; halves the ally's damage on a Tier 3).
- **Encounter:** Marksman's Shot, Volley, Covering Fire, Pinning Shot, Twin Shot. **Daily:** Hunter's Focus, Deadeye, Rain of Arrows. **Passives:** Killer's Focus, Harrying Shots, Vanish, Hunter's Edge, Sure Step, Finisher, Staggering Shot. **Apex:** Deathmark, Open Season.
- **The budget (`book/ruler/pc-budget.md`):** today's Archer is worth 163 to 200 points a turn against a target of 130 to 150 (the Double Shot build about 170, the Rolling Shot build about 190). Almost every card is a Weapon Attack with something added: the charter's finding ("every Action is damage").

## What carries over from the Paladin's redesign

The charter (`book/class-charter.md`: 18 cards, the kinds, the complexity budget); the card Structure; the rules written for it (a Reaction's target, Setup, Modes, durations only rounds or EoT, "Tier 1 or 2"); Judge's lessons for the mark (no Frequency, certain, one mark, "counts as ... for you"); the choices rule (every candidate the rules offer, the rejected ones with reasons).

## Research

`book/research/archer.md` (2026-11-16; one pass). What matters most for this brief: **(1) what bores is one best button repeated** (4e's Twin Strike: "Every. Single. Ranger. Uses. Twin-Strike. Almost. Every. Round."; Pathfinder 2e's flurry ranger: "stand in one spot and shoot arrows"), and "hitting a lot of times" is that shape, so the hits must come from several different cards; **(2) the shots that move are the ones the same players liked** (4e's Nimble Strike, "Shift 1 square before or after you attack"; Draw Steel's Fade, one card for bow or blade); **(3) range is paid for by less damage, danger up close, or things in the line of fire**, and no card should erase those for free; **(4) the map moves a shooter better than a rule does.**

## Decision 1: the class's numbers (PROPOSED 2026-11-16, waiting for Lucas)

| | Today | Proposed | Why |
|---|---|---|---|
| Modifiers | Weapon +2, Power +1 | **keep, fixed** | "precise": the best Weapon Modifier a level 1 character has |
| Health | high 16, low 8 | **keep** | "fragile": 24 against the Paladin's 30 |
| Rally | 5 | **keep** | one less than the Paladin |
| Speed Modifier | +1 | **keep** | "very mobile": the cards carry the rest (movement inside Actions), so the base stays readable |
| Armor Training | Medium (AD 13) | **Light (AD 12)** | "fragile... keep on the back lines": today it is 1 under the Paladin's 14; a class that is hard to reach and hard to hit is the "safest and highest damage at once" the research warns of |
| Attributes | Body or Instinct +1, Mind or Appeal +1 | **keep** | |
| The Sharpshooter Feature's 3 Mastery with one Projectile weapon | | **to decide with the Features** | the brief's melee strike needs a second weapon's place |

**Two questions on the brief, before the Features:**
1. **"moving side to side to distract enemies":** what does distracting do at the table? (a) the enemy he just shot is worse at hitting others (a Bane, or Taunted); (b) his allies are better at hitting it (a Boon: he draws its eye); (c) only the fiction: he is hard to pin down, and the mechanics are his own movement.
2. **"fast to change to melee for a quick strike":** with a second weapon he carries (a dagger, a short sword: the weapons pass does bows and swords) and swaps to for free, or with the bow in hand?

**Lucas's answer (2026-11-16): the numbers are DECIDED as proposed** (Weapon +2 / Power +1 fixed; Health 16 / 8; Rally 5; Speed +1; **Light armor**; Attributes kept). **Distracting is fiction, "maybe causing vulnerable"** (Vulnerable: Actions against the creature gain Boons; a candidate rider). **The melee strike: "Quick swap and stab with a light weapon yes."**

**His words on the research (2026-11-16):** "when I was playtesting, Double Shot was quite boring. We need to be careful with this class. We could even create a specific class mechanic like 'Arrows' that are a pool of dice to have the fiction of multiple shots. Or Actions that are multiple APs, roll one attack against multiple enemies etc. Research about how to make 'death by a thousand cuts' is worth it. I even thought about giving Archer +3 Weapon but wouldnt be good. Maybe Field boon to ranged being common is an idea etc."

**Ideas on the table for the class's identity mechanic (his, to weigh after the research):** (1) "Arrows", a pool of dice that stands for many shots; (2) Actions of several AP that roll once against several enemies; (3) a Field Boon that ranged attacks get often; (not) Weapon +3.

## Decision 2: the identity mechanic, "death by a thousand cuts" (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** Ours: a Weapon Attack with a Shortbow at Weapon +2 against AD 13 lands Tier 1 / 2 / 3 at 28 / 51 / 21% (0 / 1d6! + 2 / 1 + 1d6! + 2: about 4.7 damage a shot); each repeat of an At-will Action in a turn takes 1 more Bane; a Boon cancels a Bane; Field Boons stop at 2; Resist N is taken once from each Action. The research (`book/research/many-hits.md`): ten ways games deliver many small hits. The ones that were liked cost one roll (the margin sets the number of hits; one roll for all targets; a hit read from the die) and never whiff (a floor); the ones that were disliked are a token for each hit, and one best button repeated.

**Every candidate, with its reason:**

| # | The mechanic | One roll? | Tracks | For | Against |
|---|---|---|---|---|---|
| A | **Arrows by Tier:** a Strike's Tiers say how many arrows land ("Tier 1: 1 arrow. Tier 2: 2 arrows. Tier 3: 3 arrows"); each arrow is a small fixed damage and can go to a different creature | yes | nothing | many hits on one target or several; never a whiff; Resist is taken once; the Tiers cap what the 40k games' margin left open | a new defined word ("arrow"); each arrow's damage is another die |
| B | **One roll for several targets** (his idea; today's Twin Shot; Draw Steel's Two Shot) | yes | nothing | fast; known | many hits only against many enemies |
| C | **"Arrows", a pool of dice** (his idea): a few dice he holds and adds to Strikes as extra hits | yes | a pool | the fiction of a quiver; a choice of when | "I don't think the game needs more tracking" (his words, on the Paladin); per-hit pools are what players call fiddly |
| D | **A hit read from the dice:** when either d12 of his Strike shows 9 or more (56%), another arrow lands | yes | nothing | a moment at every roll; no decision to slow the turn | no decision either; swingy |
| E | **A Field Boon for having moved** (his idea): his [Ranged] Strike gains 1 Field Boon if he left his square since his last Strike | n/a | this turn only | it pays for movement, cancels the second shot's Bane, and gives the map a reason | alone it makes Weapon Attack the best button again (move, shoot, move, shoot) |
| F | **No At-will Bane on his shots** | n/a | nothing | "shooting fast" in one line | it is the one-button trap exactly (Twin Strike) |
| G | **A different card each time:** each Strike after the first in his turn that is a different Action deals a little more | n/a | this turn only | pays for variety, the research's cure | a bonus to remember; it steers him by a rule, not by the map |
| H | **A flat rider on every hit** (+1 a hit after the first) | n/a | a count | simple | small numbers to remember; flat reductions eat it |
| I | **The hits are description** (one number, told as three arrows) | yes | nothing | free | he wants the hits to exist |
| J | **Small hits build a meter, one blow cashes it** (Exalted) | | a meter | | the nova: the opposite of the brief |
| K | **Weapon +3** | | | | his own: "wouldnt be good" |

**Claude's pick: A as the way the Archer's Strikes are written, with E inside the cards, not as a standing Feature.**
- **A is the class.** "Arrows" becomes a word on the card, not a pool on the sheet: his idea's fiction with no tracking. One roll, up to three hits, split as he likes. A Tier 1 still lands an arrow, which is what "many small hits" feels like at the table: he never whiffs, and never lands one big number.
- **B comes free inside A** (the arrows can go to different creatures), so there is one mechanic instead of two.
- **E goes on cards** ("Setup: Evade 2" or "then you Evade 2": shoot, then move away), because as a standing Boon it brings back the one best button.
- **Weapon Attack stays for everyone;** his cards are simply better than repeating it.

**What a card would look like** (a sketch to judge the mechanic, not a proposal; the numbers are rough):

> **Quick Shots** · Round · 2 AP
> *You loose arrow after arrow before the first has landed.*
> Weapon · Ranged · Shot · Strike
> Distance: Weapon | Target: One creature
> **Arrow:** [V] 1d4 + [Mod] Pi. Each arrow after the first can hit another creature within 3 squares of the target.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** 1 arrow.
> **Tier 2:** 3 arrows.
> **Tier 3:** 4 arrows.
> **Effect:** You Evade 2.

About 2.7 arrows a use (28 / 51 / 21%), 4.5 damage each: 12 damage, about 41 points of a 2 AP card's 50, before the Evade.

**For Lucas:** which mechanic (A, or another, or a mix); whether an arrow's damage is written on each card (the sketch) or once on a Feature ("your arrow deals...").

**Lucas's answer (2026-11-16): "A looks good." The arrow's damage is written once, on a Feature. "And needs to write: Is the damage rolled before choosing who the arrows hit, or after?"** DECIDED: arrows by Tier is the class's mechanic.

## Decision 3: the first Feature, what an arrow is (PROPOSED 2026-11-16, waiting for Lucas)

**Rules first.** Chapter 1, Several Targets: "you roll once, after the targets are chosen... The Tier, Doubles and Critical are decided separately for each creature... Damage is rolled per Tier: ... roll that Tier's damage once and apply it to every creature on that Tier." Weapon Damage: [W] is "a flat number plus at most one small die" that changes with the Tier (a Shortbow: 0 / 1d6! / 1 + 1d6!; a Longbow: 0 / 1 + 1d4! / 2 + 1d4!); the bows are rebuilt in the weapons pass. Resist, Guard and a reduction are taken once from each Action.

**His question, answered by the design: there is nothing to choose after the roll.** An Action's arrows land on the Action's target. A card that shoots several creatures names them as its targets, and Several Targets already says what happens: the targets are chosen before the roll, and each creature gets its own Tier, so its own number of arrows. No arrow is ever handed out after the dice are seen. (The sketch's "each arrow after the first can hit another creature" is dropped: it let him roll against an easy target and send the arrows to a hard one.)

> **Quick Nock** · Passive
> *Your hand is on the next arrow before the last one lands.*
> **Arrow:** Some of your Actions land arrows. An arrow deals the die of your Projectile weapon, exploding, as [V] damage of the weapon's subtype (a Shortbow: [V] 1d6! Pi). Nothing is added to an arrow, your Modifier included.
> **Passive:** When several arrows land on a creature, roll all their dice together: it is one instance of damage. An Action's arrows land on its target; an Action with several targets gives each its own Tier and its own arrows.

**Priced:** not priced by itself (it defines a word; the cards that land arrows carry the price). A Shortbow's arrow averages 4.2 damage: about 14 points [SIM: 3.4 a point of damage].

**Analysis.**
- **The decision it gives:** none alone; it is the word every Strike of his is written in.
- **Why the weapon's die and nothing added:** the weapon still matters (a d6 bow against a d4 one), and with no Modifier on each arrow a card's Tiers can land three or four arrows without the Modifier being counted four times. His Weapon +2 does its work on the roll: it is what gets him to Tier 2 and Tier 3, where the arrows are.
- **One instance:** Resist, Guard and Shield-of-Faith-like reductions are taken once from the arrows of an Action, not once an arrow. Without this line "many small hits" would be the worst damage in the game against any flat reduction.
- **Speed:** one attack roll, then a handful of small dice thrown together. No second 2d12.
- **Rules it touches:** a defined word on a Feature that other cards use (new: the Paladin's "Smite dice" lived on its own card). The Longbow's flat number (1 or 2) is lost on an arrow: for the weapons pass, which rebuilds the bows anyway.
- **What it doesn't do:** it gives no arrows. A Weapon Attack stays a Weapon Attack.

**For Lucas to choose:** (1) the arrow's damage: the weapon's die (this), or a flat number with no roll (2 + nothing: the fastest, and the steadiest); (2) the name (Quick Nock; others: Fletcher's Hand, Loose, Arrows).

**Lucas's answer (2026-11-16): "isnt that just 1[W], 2[W] etc?"** Yes. **The Feature and the word "arrow" are WITHDRAWN.** The book already has the notation: "2[W] is two instances: the flat number twice and two dice" (Chapter 1, Weapon Damage). The mechanic stays as decided (the number of hits grows with the Tier), written as the book writes it:

> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 2[W] + [Mod].
> **Tier 3:** [V] 3[W] + [Mod].

What the "arrow" had that N[W] doesn't, and how each is kept without a new word: **(1) a Tier 1 that lands something** (every weapon's [W] is 0 on a Tier 1): the card writes a small Tier 1, as Binding Light does ("[V] [Mod] Pi" is already the book's notation); **(2) no Modifier counted on every hit:** [Mod] is written once on the line, as always; **(3) one reduction an Action:** Resist is already taken once from an Action's damage. "Arrows" stay in the Flavor lines. With a Shortbow at Weapon +2 the three lines above average 2 / 10.4 / 17.6: 9.6 damage a use, about 33 points of a 2 AP card's 50, so there is room for the movement.

**To watch (rules-backlog, "HOW A PC'S DAMAGE GROWS"):** at 15 Mastery 1[W] becomes 2[W]; a class whose cards already say 3[W] meets that step differently. For the Stages work.

**This frees the first Feature slot.** The class's two Features are now both open: its identity (what every Archer has that says "many hits, on the move") and its Rule-bender (the quick swap to a light weapon is the candidate).

## Decision 4: the two Features (PROPOSED 2026-11-16: six candidates, waiting for Lucas)

Lucas: "Propose a few features, can be more than two, according to the research."

**Rules first.** Using a [Ranged] Action while Engaged is Doomed; against a creature Engaged with someone else, 1 Field Bane (Chapter 3). Drawing, stowing or swapping a weapon is the Interact Action (1 AP); at 8 Mastery a weapon is drawn or stowed once a turn for free (Chapter 15). A Dagger deals [V] 0 / 2 + 1d4! / 4 + 1d4! (more than a Shortbow's 0 / 1d6! / 1 + 1d6!). An Evade triggers no Reactions and can't enter Difficult Terrain. Each repeat of an At-will Action in a turn takes 1 more Bane; a Boon cancels a Bane; Field Boons stop at 2.

> **1. Shifting Aim** · Passive (his Field Boon idea)
> *You never loose twice from the same spot: a step to the side, and the line is clean again.*
> **Passive:** Your [Ranged, Strike] Actions gain 1 Field Boon if you have left your square this turn since your last [Strike] Action (or since your turn began).

About 5 points a turn [judgment: a Boon on one or two shots]. It pays for "moving side to side" and cancels the second shot's Bane, so a turn of shoot, move, shoot is as good as standing still for three. Research: the map moves a shooter better than a rule; this is a rule that points at the map. Tracking: this turn only. Field Boons stop at 2, so it shares the limit with Flanking and high ground.

> **2. Darting Blade** · Round · 1 AP (the quick strike; Draw Steel's Fade)
> *You let the bow drop on its strap, open a foe with the knife, and are gone before it turns.*
> Weapon · Melee · Strike
> Distance: Reach | Target: One creature
> **Setup:** You stow your bow and draw a one-handed melee weapon.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod].
> **Effect:** You Evade 2, then can stow that weapon and draw your bow.

A Weapon Attack with a Dagger (25) + the floor (2) + Evade 2 (about 8) + two free swaps (2 AP of Interact he never has to pay: not priced): about 35 for 1 AP, held by its Round Frequency. It answers the research's "danger up close, with something good to do there": Engaged, his bow is Doomed, and this is what he does instead. It is the brief's line as one card.

> **3. Loose and Move** · Passive (the shot that moves; 4e's Nimble Strike)
> *You are already moving when the arrow leaves the string.*
> **Passive:** Once on each of your turns, after you use a [Ranged, Strike] Action, you can Evade 2.

About 8 points a turn [judgment: most of an Evade Action]. "Shooting fast and precise, then moving away", every turn, on any card. The players who hated Twin Strike liked exactly this. Its risk: it is free and always the same, so no decision but where to step.

> **4. Sure Hand** · Passive (the floor: never a whiff)
> *An arrow of yours always finds something.*
> **Passive:** When your [Ranged, Strike] Action gets a Tier 1, it deals [V] damage equal to your Weapon Modifier, of your weapon's subtype, if that Tier would deal less.

About 2 points a Strike, 6 a turn [SIM: 28% of shots, 2 damage]. The research's plainest finding on small hits is that they don't miss (Tweet; ICON's "On miss: fray"). On a Feature, every shot has it, the Weapon Attack included, and no card needs a Tier 1 line of its own.

> **5. Harry** · Passive (his "maybe causing vulnerable")
> *Your arrows come from a new side each time, and your foe can't watch them and the swords at once.*
> **Passive:** Once a round, when you damage a creature with a [Ranged, Strike] Action from a square you entered this turn, it is Vulnerable 1 (EoT).

Vulnerable 1 is a Moderate rider (8 points), every round, with no Save. **A caution from his own ruling (2026-11-04):** the old Archer's Harrying Shots, a Bane every round with no Save, was judged too strong. Better as an Escalation ability or an Art's Mode than as a Feature.

> **6. Slip Away** · Round · 0R (today's Vanish)
> Distance: Self | Target: You
> **Interrupt:** An enemy would enter a square adjacent to you.
> **Effect:** You Evade 2.

The fragile back-liner's escape. Strong as a Feature (it denies a melee enemy its turn every round): a Hallmark Reaction's place, with a cost of 1R.

**Not proposed, and why:** *no Doomed on his bow while Engaged* (it erases a cost of range for free: what 5e's feats did); *no At-will Bane on his shots* (Twin Strike's trap).

**Claude's pick for the two Features: 1 (Shifting Aim) and 2 (Darting Blade).** Shifting Aim is the identity: many shots, earned by moving; it is his own idea and the only candidate that makes the map matter. Darting Blade is the Rule-bender (a swap that costs nothing, inside one card). 3 becomes the Effect line of his Hallmark Strikes (movement written on the card, shoot then move); 4's floor is written on each card's Tier 1; 5 and 6 go to the Escalation abilities and the Reactions.

**Lucas's answer (2026-11-16): THE TWO FEATURES ARE DECIDED: 1 (Shifting Aim) and 2 (Darting Blade)**, with "a one-handed light melee weapon" in Darting Blade's Setup; **Light will be a weapon property**. He asked how a property is written in a line. **The book's rule (Chapter 1, Rules Language, "Weapons by property"):** "When a rule names a weapon property before the word 'weapon,' it means a weapon with that property": **"a Light weapon"**, capitalized, no brackets (brackets are for traits), no color. So the Setup reads "You stow your bow and draw a Light weapon." (When the weapons pass writes the property, Light says it is one-handed and melee, so the card doesn't have to.) **5 (Harry) is "good for later"**: an Escalation ability.

> **Shifting Aim** · Passive
> *You never loose twice from the same spot: a step to the side, and the line is clean again.*
> **Passive:** Your [Ranged, Strike] Actions gain 1 Field Boon if you have left your square this turn since your last [Strike] Action (or since your turn began).

> **Darting Blade** · Round · 1 AP
> *You let the bow drop on its strap, open a foe with the knife, and are gone before it turns.*
> Weapon · Melee · Strike
> Distance: Reach | Target: One creature
> **Setup:** You stow your bow and draw a Light weapon.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod].
> **Effect:** You Evade 2, then can stow that weapon and draw your bow.

## Decision 5: the two Hallmark Actions (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** The charter: the two Hallmark Actions are a choice of style, not of role; the Paladin's rule of a 2 AP Hallmark Strike gave him a turn of 2 + 1 + 1 and fewer rolls. Several Targets (Chapter 1): one roll after the targets are chosen, each creature its own Tier. A Setup happens first and the Distance is checked after it (Chapter 2). Research: what bores is one best button (Twin Strike; Lucas: "Double Shot was quite boring"); the shots that move were liked; one roll for several targets is fast (Draw Steel's Two Shot) but gives many hits only against many enemies. A 2 AP Round card is worth about 50 points; a Shortbow's 1[W] is 1d6! on a Tier 2 and 1 + 1d6! on a Tier 3; his Tiers are 28 / 51 / 21%.

> **Quick Shots** · Round · 2 AP (one foe, many arrows, then gone)
> *You loose arrow after arrow into one foe before the first has landed, and step away while it reels.*
> Weapon · Ranged · Shot · Strike
> Distance: Weapon | Target: One creature
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 2[W] + [Mod].
> **Tier 3:** [V] 3[W] + [Mod].
> **Effect:** You Evade 2.

```
Damage 2 / 10.4 / 17.6 at 28 / 51 / 21% = 9.6 ... 33   [SIM: 3.4 a point of damage]
Effect: Evade 2 after the shot ... 8   [judgment: most of an Evade Action]
--- Total: about 41, of 50: a little under (it never whiffs, and Shifting Aim's Boon often rides on it)
```

> **Strafe** · Round · 2 AP (on the run, an arrow each)
> *You run across the line of fight and put an arrow into each foe you pass.*
> Weapon · Ranged · Shot · Strike
> Distance: Weapon | Target: Up to two creatures
> **Setup:** You Advance.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 2[W] + [Mod].

```
Damage 2 / 6.2 / 12.4 = 6.3 a creature; about 1.8 creatures ... 38   [SIM; the count is judgment]
Setup: a full Advance inside the card ... 12   [SIM: an AP is 12]
--- Total: about 50, of 50: on
```

**Analysis.**
- **The choice is a style:** Quick Shots plants him for a breath, pours three hits into one enemy and steps away; Strafe keeps him running and spreads small hits. Neither is support or control: the brief has neither.
- **Not Double Shot:** each is one roll. Quick Shots' hits come from the Tier; Strafe's from Several Targets (each creature its own Tier).
- **No one best button:** both are Round cards, so each is used once a turn; the rest of his 4 AP goes to Darting Blade, a Weapon Attack with Shifting Aim's Boon, an Art, or moving.
- **With Shifting Aim:** Strafe's Setup has moved him, so it always has the Boon; Quick Shots has it if he moved first, and its Evade sets up the next shot's Boon.
- **Rules they touch:** nothing new. Strafe's Advance is a Setup: optional, and the Distance and targets are checked after it. "[V] [Mod] Pi" on a Tier 1 is the book's notation.
- **Table feel:** Quick Shots is one roll and up to three weapon dice thrown together; Strafe is one roll read against two Defenses.
- **Complexity:** one Version each, one rider each (the Evade; the Advance).

**For Lucas to choose:** the pair, or another style for the second (Strafe's count: two creatures, or three with a smaller Tier 3); the names.

**Lucas's answer (2026-11-16):** "They both need the projectile trait" (they have Shot, the trait that needs a Projectile weapon: Chapter 7); "both are too similar, but at the same time, it might be good to keep them like this. What you think, variance or similarity?" Claude: variance in shape, not in role: depth against width. **"Change strafe to that." THE HALLMARK ACTIONS ARE DECIDED:** Quick Shots as proposed, and:

> **Strafe** · Round · 2 AP
> *You run across the line of fight and put an arrow into each foe you pass.*
> Weapon · Ranged · Shot · Strike
> Distance: Weapon | Target: Up to three creatures
> **Setup:** You Advance.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod].

About 5.2 damage a creature, about 2.3 creatures: 41, + 12 for the Advance: about 53, of 50. Quick Shots is the only one of the two whose hits multiply with the Tier (depth: one enemy taken apart); Strafe is one hit each on many (width: the whole line harassed).

**He asked: rename the trait Shot to Projectile, so "I have a Projectile weapon, so I can use this Projectile Action", though one is a trait and one a property with the same name?** Claude's answer: yes, and Gun to Firearm with it. The book already does exactly this with **Melee** and **Ranged**, each both a trait and a weapon property, and its language rule tells them apart by the next word ("a [Melee] Action", "a Melee weapon"). Shot / Projectile and Gun / Firearm are the two pairs that don't match, so they are two extra words to learn for nothing. The cost is real but mechanical: Chapter 7, Chapter 15, the Glossary, every Archer card, and in Foundry the trait keys `shot` and `gun` (a migration), the tests and the ruler. **When: with the weapons pass (bows first) for the book and with the Foundry pass for the system; until then the Archer's cards write Shot.** Waiting for his word.

## Decision 6: the two Hallmark Reactions (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** A Reaction's Target (Chapter 2): a Target line, the Interrupt or Trigger written about "the target", Line of Effect to it. Moving Closer is defined (an Interrupt checks before the creature enters the nearer square; a Trigger fires once, at the point of the movement he chooses). Using a [Ranged] Action while Engaged is Doomed. A 1R Reaction is worth about 10 to 15 points a turn, and the charter wants it used in about half the rounds. Research: a close enemy should be danger, with something good to do (archer.md, 5); the 4e posters liked "get the hell out of dodge" (2). Today's two: Overwatch (a shot at an enemy that moves closer; Hindered) and Covering Shot (a shot at an attacker; halves the ally's damage on a Tier 3: support, which this brief doesn't have).

> **Slip Away** · Turn · 1R (flee)
> *The moment a foe commits to reaching you, you are already somewhere else.*
> Distance: 5 sq. | Target: One enemy
> **Interrupt:** The target would enter a square adjacent to you.
> **Effect:** You Evade 2.

```
A melee hit avoided when the enemy has no movement left to follow: about 40% of uses, about 3.3 Health each ... 16 a use   [judgment; Health 12 a point]
Used in about half the rounds ... about 8 a turn, of 10 to 15: a little under
```

> **Overwatch** · Turn · 1R (shoot)
> *You hold an arrow on the string, and loose it at the first foe that comes for you.*
> Weapon · Ranged · Shot · Strike
> Distance: Weapon | Target: One enemy
> **Trigger:** The target moves closer to you.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod].

```
A Weapon Attack with the floor ... 27 a use   [SIM: a Weapon Attack is 25]
Used in about half the rounds ... about 14 a turn, of 10 to 15: on
```

**Analysis.**
- **The choice is a style, again:** when something comes for him, one Archer is gone and the other puts one more arrow in it. Neither protects an ally: the brief has no support.
- **Slip Away is the fragile back-liner's answer** to being reached; an enemy with movement left can still follow, so it is a delay and a Reposition of the fight, not immunity. It is the 1R version of today's free Vanish (which denied a melee enemy every round).
- **Overwatch is one more small hit a round,** the brief's damage by count. It loses today's Hindered (control) and gains the floor. As a Trigger he chooses the moment during the movement, so he shoots before the enemy is adjacent and his bow Doomed.
- **Rules they touch:** nothing new; both are written about "the target".
- **With the rest:** Slip Away's Evade is outside his turn, so it gives no Shifting Aim Boon. Both compete for his one Reaction AP.

**For Lucas to choose:** the pair; Slip Away's distance moved (2, or 3).

**Lucas (2026-11-16): "I think overwatch will be an every round thing, as usually moving closer to the archer is the same as walking closer to allies, so it would be quite disruptive."** He is right, and the SIM had already measured it: today's Overwatch (an enemy within 10 squares moves closer to you or an ally) fires 0.46 to 0.81 times a round (`book/ruler/reactions.md`: 56% of rounds in a normal fight, 73% in a deadly one), against the charter's "about half the rounds". My price assumed half; at its real rate it is about 20 points a turn, and an extra 2d12 roll almost every round.

**Every moment the rules offer for a Reaction shot (Chapter 2, "What a Reaction Responds To"), with how often it comes up:**

| The trigger | How often | For | Against |
|---|---|---|---|
| The target moves closer to you (the draft) | most rounds [SIM: 0.5 to 0.8] | | his point: every round, disruptive |
| The target moves closer to you, within 5 squares | many rounds [judgment] | tighter | still most enemies that come his way |
| **The target would enter a square adjacent to you** | when he is reached: about a third of the rounds [judgment: a back-liner] | the same moment as Slip Away, so the pair is one question with two answers; an Interrupt, so he shoots before it is adjacent and his bow Doomed | it only fires when the line has failed |
| The target damages you | when he is hit | a revenge shot | adjacent by then: Doomed |
| The target makes a [Ranged] Strike against you or an ally | only against shooters | a duel | dead against melee enemies |
| The target becomes Bloodied / an ally scores a Tier 3 against it | about once a round in a fight of four [judgment] | hits with the party | every round again |
| The target Stands, or falls Prone | rare | | too rare to choose |
| The target moves away from you | rare for a shooter | | Rebuke's trigger; not his fantasy |

**Proposed, replacing Overwatch:**

> **Snap Shot** · Turn · 1R (stand and shoot)
> *A foe lunges for you, and you put an arrow in it before it has finished the step.*
> Weapon · Ranged · Shot · Strike
> Distance: Weapon | Target: One enemy
> **Interrupt:** The target would enter a square adjacent to you.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod].

27 a use, in about a third of the rounds: about 9 a turn, of 10 to 15 (Slip Away: about 8). **The pair is now one moment with two answers:** an enemy is about to reach him; he is gone (Slip Away, and he takes no hit), or he shoots it in the face and stays (Snap Shot, and he is then Engaged). Both fire only when he is reached, which is rare for a back-liner who plays well: a Reaction that rewards the enemy's success, not every enemy's turn.

**Lucas's answer:**
