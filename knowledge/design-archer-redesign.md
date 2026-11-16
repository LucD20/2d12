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

**Lucas's answer (2026-11-16): THE HALLMARK REACTIONS ARE DECIDED, with two changes of his.** Slip Away: "You Evade 1, then Advance 2. This way, you can move more and still attempting to dodge. But maybe it would be overpriced?" Snap Shot: add Hindered (EoT) "to put it up to speed, just in some tiers if it would be too strong... Quite niche." **And "Yes": the trait Shot is renamed PROJECTILE and Gun is renamed FIREARM.** From here the Archer's cards write Projectile.

> **Slip Away** · Turn · 1R
> *The moment a foe commits to reaching you, you are already somewhere else.*
> Distance: 5 sq. | Target: One enemy
> **Interrupt:** The target would enter a square adjacent to you.
> **Effect:** You Evade 1, then Advance 2.

**Not overpriced.** Three squares shake off an enemy with a little movement left more often than two (about half the uses against 40% [judgment]): about 20 a use, about 7 a turn at a third of the rounds, still under a Reaction's 10 to 15. The first square is safe; the two of the Advance can cross Difficult Terrain (an Evade can't) and can trigger an enemy's Reaction (few NPCs have one).

> **Snap Shot** · Turn · 1R
> *A foe lunges for you, and you put an arrow in it before it has finished the step.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One enemy
> **Interrupt:** The target would enter a square adjacent to you.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 1[W] + [Mod]; Hindered (EoT).
> **Tier 3:** [V] 1[W] + [Mod]; Hindered (EoT).

**Hindered here is more than niche:** Chapter 8 says "If you become Hindered while you are moving, the movement you have left is halved too", and an Interrupt happens before the step. So on a Tier 2 or 3 (72%) the enemy's remaining movement is halved in mid-stride, and it may not reach him at all. EoT ends with the enemy's own turn, so it is that one move only. Hindered (EoT) is a Mild rider (3): about 30 a use, about 10 a turn: on.

**The trait rename, where it lands:** in the book, the builder can print the old key `shot` as "Projectile" (and `gun` as "Firearm") at once, with Chapter 7's two headings, Chapter 15 and the Glossary rewritten, when the Archer is applied; the card files' keys and Foundry's change with the Foundry pass.

## Decision 7: the three Arts, their themes first (PROPOSED 2026-11-16, waiting for Lucas)

An Art is a Round card of 1 AP with three Modes, for what is neither damage nor healing (the charter); he takes one at level 1 and a second at level 3. With the Paladin the themes were chosen first (light, the line, the word), then each Art. **Four themes for three places:**

| Theme | What its three Modes would do | From |
|---|---|---|
| **Footwork** | moving where others can't: a longer Evade; crossing Difficult Terrain or a creature's space; getting up from Prone and away | the brief: "very mobile, running away or moving side to side" |
| **Trick shots** | an arrow that does something instead of damage: pins a cloak (Hindered), knocks a thing from a hand or off a ledge, startles (his "distract": Vulnerable 1) | research: the praised non-damage tools are riders with a choice (4e's Clever Shot, "the star of the show") |
| **The hunter's eye** | reading the field: calling out a Hidden creature so allies perceive it; ignoring far range or Cover for one shot; naming the Bloodied | our Senses, Cover and range rules: a shooter's use of the map |
| **Quick hands** | the hands' tricks: swapping weapons, catching or picking up, reloading a crossbow on the move, handing an item to an ally | the brief: "fast to change to melee"; research: Reload is liked when bundled with a move |

**Claude's pick: Footwork, Trick shots, The hunter's eye.** Quick hands overlaps Darting Blade (the swap is already free there) and is mostly about a crossbow.

**Lucas's answer (2026-11-16): "I like all four honestly, we can merge some reload on the move and such to the footwork. Then can be the first three." THE THEMES ARE DECIDED: Footwork (with Quick hands' reload and swap on the move merged in), Trick shots, The hunter's eye.**

## Decision 8: the first Art, Footwork (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** The Evade Action: 1 AP for Evade 1, 2 AP for Evade half your Speed (3 for a Human Archer, Speed 6). An Advance is 1 AP for his whole Speed and triggers Reactions; passing through an unwilling creature's squares is Difficult Terrain; an Evade can't enter Difficult Terrain at all (Chapter 3). Interact (1 AP) draws, stows, swaps or grabs; the Reload Action reloads a Reload weapon after its stronger shot (Chapter 15). A Linked Action is written "(1A)" and keeps its own requirements. Shifting Aim pays a Field Boon for having left his square. Research: a reload is "a tax" alone and liked when bundled with a move (Pathfinder 2e's Running Reload); the move-and-shoot at-wills were the liked ones. An AP is worth about 12 points; an Art's Mode should be a little better than the Basic Action it replaces, never a new best button.

> **Footwork** · Round · 1 AP
> *You are never where you were a breath ago: a long sidestep, a run through the press, or a step with your hands already busy.*
> — **Sidestep** —
> **Effect:** You Evade 3.
> — **Weave** · Move —
> **Effect:** You Advance. During this Advance, Difficult Terrain doesn't slow you, and you can move through the squares of unwilling creatures (you can't end in one).
> — **Hands Busy** —
> **Effect:** You Evade 1, and before or after it you use the Interact or Reload Action (1A).

```
Sidestep: Evade 3 for 1 AP (the Evade Action asks 2 AP) ... saves 1 AP: 12   [SIM: an AP is 12]
Weave: an Advance (1 AP anyway) that ignores Difficult Terrain and bodies ... 4 to 8   [judgment: only where the map has them]
Hands Busy: an Evade 1 and an Interact or a Reload for 1 AP (2 AP apart) ... saves 1 AP: 12
--- Each Mode: 1 AP that does the work of about 2. One use a round.
```

**Analysis.**
- **The decision it gives:** which kind of ground he has to cover this round: clean distance from a threat (Sidestep), a way through a blocked or rough place (Weave), or a step while he reloads a crossbow, picks something up or changes weapons (Hands Busy).
- **With Shifting Aim:** every Mode leaves his square, so each sets up the Boon on his next shot. That is the class's loop: move with purpose, then shoot.
- **Against the one-button risk:** it deals no damage, and as a Round card it is one use a turn; the three Modes answer three different maps.
- **Merged from Quick hands, as he asked:** the reload and the weapon swap on the move are Hands Busy. Darting Blade keeps its own free swap.
- **Rules it touches:** nothing new. "(1A)" makes the Interact or Reload a Linked Action, so it keeps its requirements (Interact needs a free hand). Weave has the Move trait because it is an Advance; the other two don't (the Evade Action has none).
- **Left out:** standing up from Prone and away (a fourth Mode; an Art has three).
- **Complexity:** three one-sentence Modes; no roll, no target.

**For Lucas to choose:** the three Modes; Sidestep's 3 (or half his Speed, which is 3 for a Human and 2 or 3 for others); the names.

**Lucas's answer (2026-11-16): "All good. Proceed." FOOTWORK IS DECIDED as proposed.**

## Decision 9: the second Art, Trick Shots (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** A Strike is "any Action that tries to hit a creature", and **a creature makes at most 3 Strikes a turn** (Chapter 7): the Archer's whole turn lives under that cap, so a trick shot spends one of his three. Hindered halves Speed; Vulnerable 1 gives 1 Boon to every Action against the creature; Pushed is Forced Movement away from the origin (Chapter 8, Chapter 3). There is no rule for disarming (the word appears once, on Barehanded), so no Mode does it. Lucas: distracting is fiction, "maybe causing vulnerable". Research: the praised non-damage tool is a rider with a choice (4e's Clever Shot: slide, prone or slowed; "the star of the show"); an archer that is only control was the Seeker's failure. A rider on an enemy is priced Mild 3, Moderate 8; an AP is worth about 12; the third Weapon Attack of a turn (2 Banes) is worth little.

> **Trick Shots** · Round · 1 AP
> *You put the arrow where it will do something other than wound: through a cloak, past an ear, square on a shield.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One creature
> **Attack:** Weapon vs. Armor Defense
> — **Pin** —
> **Tier 2 or 3:** [V] [Mod] Pi; Hindered (1 round).
> — **Startle** —
> **Tier 2 or 3:** [V] [Mod] Pi; Vulnerable 1 (EoT).
> — **Knock Back** —
> **Tier 2:** [V] [Mod] Pi; Pushed 1.
> **Tier 3:** [V] [Mod] Pi; Pushed 2.

```
Each Mode lands on a Tier 2 or 3: 72% of uses
  [Mod] damage (2) ... 5   [SIM: 3.4 a point of damage]
  Pin: Hindered for a round ... about 4   [judgment: a Mild rider, a round instead of EoT]
  Startle: Vulnerable 1 until its turn ends ... about 6   [Lucas's rider table: Moderate 8]
  Knock Back: Pushed 1 or 2 ... not priced (positions; suggested about 5)
--- Each Mode: about 9 to 11, of an AP's 12: a little under a plain third action, and better than a third Weapon Attack with 2 Banes
```

**Analysis.**
- **The decision it gives:** what the party needs from this arrow: an enemy that can't cross the room (Pin), an enemy everyone hits more easily until its turn ends (Startle), or an enemy moved off an ally or toward an edge (Knock Back).
- **Startle is his "distract",** and the one Mode that helps his own turn: used first, his other shots at that creature this turn have a Boon. That is the class's small combo, and it costs 1 AP and one of his 3 Strikes.
- **Why a little damage after all:** an Art is "neither damage nor healing", but an arrow that hits and does nothing reads wrong, and a rider alone is worth less than half an AP. [Mod] (2) is the class's floor, not a damage card.
- **Not the Seeker:** one card, once a round; the class's damage is elsewhere.
- **One roll,** shared by the three Modes (the Attack line sits above them, as the Structure writes shared lines).
- **Rules it touches:** "Tier 2 or 3" as a line (the Structure allows a line for two Tiers). Nothing else new.
- **To weigh later:** Harry (kept for the Escalation abilities) is Startle without a roll; one of the two will change.

**For Lucas to choose:** the three Modes; whether they keep the [Mod] damage; Pin's duration (1 round, or EoT like Snap Shot).

**Lucas (2026-11-16): "Should it be a Strike? Because then it takes the penalty from multiple strikes".** Answered: the Bane for repeating comes from the At-will Frequency (each use of the same At-will Action after the first), not from the Strike trait, which only caps a turn at 3 Strikes; Trick Shots is a Round card, so it rolls clean where a third Weapon Attack has 2 Banes (the 72% assumed that). It stays a Strike: the rule defines it so ("any Action that tries to hit a creature"), and Shifting Aim's Boon is for [Ranged, Strike] Actions. **"All seems good. Proceed." TRICK SHOTS IS DECIDED as proposed** (the [Mod] damage kept; Pin: Hindered (1 round)).

## Decision 10: the third Art, Keen Eye (PROPOSED 2026-11-16, waiting for Lucas)

The theme was "the hunter's eye"; named Keen Eye here, since the hunter goes to the later ranger class.

**Rules and research first.** Senses (Chapter 3): a creature is Clear, Obscured, Hidden or Unsensed to you; Obscured is 1 Field Bane on your Actions against it, Hidden is Doomed. Cover: Low 1 Field Bane, Medium 2, High Doomed, Total no Line of Effect. Range: 1 Bane at far range, 2 at maximum. "Your next Action" with no duration must be made before the end of your turn (Chapter 2). Leaning (a Basic Action, 1 AP) already lets a creature count cover from a corner. Research: the map moves a shooter better than a rule (cover from creatures in the line, high ground); range is paid for by things in the line of fire, and a card may lift that for a price, never for free; a party-wide mark makes the shooter a spotter (Draw Steel's Mark, Lancer's Lock On).

> **Keen Eye** · Round · 1 AP
> *You read the field the way others read a page: where a foe hides, where the gap in its cover is, where you yourself are hardest to hit.*
> — **Call Out** —
> Distance: 10 sq. | Target: One creature you perceive
> **Effect:** Your allies perceive the target one step better than they do: Hidden as Obscured, Obscured as Clear (1 round).
> — **Find the Gap** —
> **Effect:** Your next [Ranged, Strike] Action this turn ignores the Banes of far and maximum range, and counts each target's Cover as one level lower.
> — **Keep Low** —
> **Effect:** Against each creature you have Cover from, your Cover is one level higher, up to High (1 round).

```
Call Out: allies stop being Doomed (Hidden) or lose a Field Bane (Obscured) against one creature for a round ... 0 in the open; about 10 to 20 in the dark or against a hider   [judgment]
Find the Gap: one shot loses 1 or 2 Banes, or a High Cover's Doomed becomes 2 Banes ... about 3 to 8   [judgment: a Boon on a Strike is about 3]
Keep Low: one more Field Bane (or Doomed) on each enemy that shoots at him behind cover ... about 4 to 10   [judgment; Health 12 a point]
--- Each Mode: nothing on a bare field, an AP's worth or more on a real map
```

**Analysis.**
- **The decision it gives:** what the map is doing to the fight this round: an enemy the others can't see, a shot the wall or the distance is spoiling, or arrows coming at him.
- **It is worth nothing on an empty field, on purpose.** It is the class's reward for a map with walls, darkness and distance: the research's "the map makes the shooter".
- **Call Out is the one thing he does for the party:** not support by healing or shielding (the brief has none), but by eyes. It only helps when he perceives better than they do: he has the line, the light or the sense they lack.
- **Find the Gap lifts range's price for a price:** 1 AP and his Round use, for one shot. Cover goes down a level, never away: Total stays no Line of Effect.
- **Keep Low needs cover to exist:** it raises a level, it doesn't make one, so it rewards where he stands.
- **Rules it touches:** "one step better" and "one level higher / lower" read the Senses and Cover tables as ladders (they are written as ladders; the sentence is new). "Your next ... Action this turn" is Chapter 2's rule. No roll, no trait.
- **Against the other two Arts:** Footwork moves him, Trick Shots does something to an enemy, Keen Eye changes what the map costs. Three different second cards at level 3.

**For Lucas to choose:** the three Modes; Call Out's distance (10); the name (Keen Eye; others: Marksman's Eye, Spotter).

**Lucas's answer (2026-11-16): "Spotter is best, all others are good. Proposed." THE THIRD ART IS DECIDED, named SPOTTER** (Call Out, 10 squares; Find the Gap; Keep Low; as written above). **The three Arts are done: Footwork, Trick Shots, Spotter.**

## Decision 11: the Escalation abilities, the ladder and the Escalation 2 pair (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** Escalation starts at 1 (plus the party's Momentum) and rises by 1 a round; an ability of Escalation 2 works from round 2, of 4 from round 4, of 6 from round 6 (earlier with Momentum or the hook). A Passive is worth about 5 to 10 points a turn; it changes a decision or fires on a moment the table sees, never a silent bonus (the charter). Each rung offers two; he takes one at levels 1, 2 and 3. The card says "Escalation N" on its bar and the sentence carries no "While..." clause (the Structure). From the Paladin: a rung's two abilities are two styles, not a strong one and a weak one.

**The ladder I would build (a steer before the cards; only the Escalation 2 pair is proposed now):**

| Rung | One style: the skirmisher | The other: the switch-hitter and the harrier |
|---|---|---|
| Escalation 2 (level 1) | **Light Feet:** a free step after a shot | **Blade and Bow:** a Boon for changing between bow and blade |
| Escalation 4 (level 2) | a floor that grows: his shots' Tier 1 lands a real hit | **Harry** (kept from Decision 4): Vulnerable 1 from a new square |
| Escalation 6 (level 3) | a fourth Strike a turn (the cap of 3 lifted by one) | a 0 AP Encounter Action: one arrow into every enemy near him, on the run |

> **Light Feet** · Escalation 2 · Passive
> *The fight has found its rhythm, and your feet keep it: loose, step, loose.*
> **Passive:** Once on each of your turns, after you use a [Ranged, Strike] Action, you can Evade 1.

```
An Evade 1 a turn (the Evade Action: 1 AP), only after a shot ... about 8   [judgment: most of an AP's 12]
From round 2, or from the start with Momentum: about three quarters of his turns ... about 6 a turn, of 5 to 10: on
```

> **Blade and Bow** · Escalation 2 · Passive
> *Arrow, knife, arrow: each sets up the next.*
> **Passive:** Once on each of your turns, when you use a [Melee, Strike] Action after a [Ranged, Strike] Action, or a [Ranged, Strike] Action after a [Melee, Strike] Action, it gains 1 Boon.

```
1 Boon on one Strike a turn, when he has woven the two ... about 4   [judgment: a Boon on a Strike is about 3 to 4]
It asks him to be within Reach of an enemy, where his bow is Doomed: the Boon pays for a risk ... about 4 a turn, of 5 to 10: a little under
```

**Analysis.**
- **The decision each gives:** Light Feet: where the free step goes after every shot (and it sets up Shifting Aim's Boon for the next one with no AP spent). Blade and Bow: whether to go in with the knife this turn at all.
- **Two styles:** the Archer who is never where he was, and the Archer who darts in and out. The brief has both lines ("shooting fast... then moving away"; "fast to change to melee for a quick strike then moving back").
- **Light Feet is candidate 3 of the Features (Loose and Move), at half its size and behind Escalation 2:** as a Feature it was free from round 1 and always the same.
- **Blade and Bow with Darting Blade:** shoot, stab with a Boon (or stab, then shoot with a Boon after Darting Blade's Evade has taken him out of Reach, where the bow is no longer Doomed). The order he picks is the play.
- **Both fire on a moment the table sees** (a shot, a change of weapon), and both are once a turn: nothing to track across turns.
- **Rules they touch:** nothing new. The Boon is unnamed; Shifting Aim's is a Field Boon, so the two add up.

**For Lucas to choose:** the ladder's two styles; the Escalation 2 pair; Light Feet's Evade (1, or 2).

**Lucas's answer (2026-11-16): "Light Feet I think it will cause some problems, lets make it different. Dont need to be in Escalation 2 but we havent used anything that allows/compresses leaning, ignore cover from allies, use more teamwork (even though i know this class is more standalone than support, we still want team work)".** LIGHT FEET IS OUT. Blade and Bow was not objected to.

## Decision 11b: the ladder again, with leaning, allies' cover and teamwork (PROPOSED 2026-11-16, waiting for Lucas)

**Rules first.** Leaning (a Basic Action, 1 AP, At-will): "Until the end of your turn, you calculate cover from one of your corners instead of the center of your square, and your own cover against other creatures' Actions is reduced by 1 level." A creature on the line between the centers gives the target Low cover (1 Field Bane), an ally included (Chapter 3, Cover). A [Ranged] Action against a creature Engaged with a creature other than yourself takes 1 Field Bane (Ranged Combat While Engaged). A creature threatens the enemies within its melee weapon's range (Flanking). Research: cover from allies is what makes Pathfinder 2e's archer move, and players accept it ("one turn of setup pays dividends"); 5e's feats that erased range's costs for free are the warning; a granted step is worth most on the ally who needs it (`movement-positioning.md`).

**Three new candidates:**

> **Lean and Loose** · Escalation 2 · Passive (leaning, compressed)
> *A wall is a quiver's best friend: you are out, the arrow is gone, and you are back.*
> **Passive:** The Leaning Action costs you 0 AP.

About 5 a turn [judgment: an AP's 12 on the turns a corner is there to lean from, less than half of them]. It makes walls his ground: he shoots from Total cover every turn without paying for it, and still pays Leaning's own price (his cover is one level lower while he leans).

> **Clear Lines** · Escalation 4 · Passive (allies in the way)
> *Your friends have learned where not to stand, and you have learned to shoot past their ears.*
> **Passive:** Your allies give your targets no Cover, and your [Ranged] Actions take no Field Bane for a target Engaged with one of your allies.

About 6 a turn [judgment: a Field Bane lifted from one or two shots most turns]. It lifts the two costs of range that his own party causes, and only those: walls, enemies in the line and distance still count. Teamwork by permission: the front line can close without spoiling his shots.

> **Opening Shot** · Escalation 4 · Passive (teamwork; Harry rebuilt)
> *Your arrow lands, the foe flinches toward it, and your ally's blade is already coming.*
> **Passive:** Once a round, when you damage a creature with a [Ranged, Strike] Action, one ally who threatens it gains 1 Boon on their next [Strike] Action against it (1 round).

About 4 to 6 a turn [judgment: a Boon on one ally's Strike]. It is Harry made into teamwork: one ally's next blow, not Vulnerable for everyone, so it no longer copies Trick Shots' Startle and is well under the old Harrying Shots he judged too strong. He chooses the ally; it rewards shooting what the front line is fighting.

**The ladder with them:**

| Rung | One | The other |
|---|---|---|
| Escalation 2 (level 1) | **Lean and Loose:** Leaning for 0 AP | **Blade and Bow:** a Boon for changing between bow and blade |
| Escalation 4 (level 2) | **Clear Lines:** allies give no Cover and no into-melee Bane | **Opening Shot:** his hit gives an ally a Boon |
| Escalation 6 (level 3) | a fourth Strike a turn | a 0 AP Encounter Action: one arrow into every enemy near him, on the run |

**Other teamwork shapes, if he prefers one:** *the ally steps* (once a round, when he damages an enemy Engaged with an ally, that ally can Evade 1: the arrow buys the ally a way out); *crossfire* (he counts as flanking an enemy an ally threatens, with [Ranged] Actions from within 5 squares: it needs a line in the Flanking rule).

**For Lucas to choose:** the three new cards; where each sits (he said it needn't be Escalation 2); whether Blade and Bow stays; the two Escalation 6 ideas.

**Lucas's answer (2026-11-16):** Opening Shot, his wording: "Once a round, when you damage a creature with a [Ranged, Strike] Action, one ally who threatens it can make a Weapon Attack (1AP) against it as a 1R." "Make a quick check if Clear Lines would be too strong." "Others are fine" (**Lean and Loose and Blade and Bow are DECIDED for Escalation 2**). Escalation 6: "Instead of a fourth strike, maybe we just do increase weapon dice by one on one attack per turn?"

**The check on Clear Lines: not too strong; a little under.** One Field Bane moves his Tiers from 28 / 51 / 21% to 35 / 48 / 17%: Quick Shots drops from 9.6 to 8.7 damage (9%). If about two thirds of his shots are at a target Engaged with an ally, and a few more have an ally on the line, lifting those Banes is worth about 1 to 1.4 damage a turn: **about 4 to 5 points, of a Passive's 5 to 10** [computed from the Tier odds; the share of shots is judgment]. Its real effect isn't the number: it removes one reason to move (the clean line past an ally). Shifting Aim gives him another, and walls and enemies in the line still count. **Clear Lines stays as written.**

**Opening Shot, his version, checked:** an ally's Weapon Attack is worth 25 points; it costs that ally their Reaction AP, which is worth 10 to 15 when they have a Reaction to spend it on and nothing when they don't. So about 10 to 25 points a round, from Escalation 4: **over a Passive's 5 to 10, by two to three times.** And it fires nearly every round (he damages something an ally threatens almost every turn), which is an extra attack roll outside anyone's turn every round: the thing he found disruptive in Overwatch. It is the best teamwork on the list (4e's Commander's Strike is the model players loved), so it is worth keeping and gating:

> **Opening Shot** · Escalation 4 · Passive
> *Your arrow staggers the foe, and your ally's blade is already coming.*
> **Passive:** Once a round, when you get a Tier 3 with a [Ranged, Strike] Action against a creature, one ally who threatens it can spend 1R to make a Weapon Attack (1A) against it.

A Tier 3 is 21% of his shots; with two or three shots a turn it fires in about half the rounds: about 6 to 12 a turn, and half the extra rolls. (Other gates: once an encounter; or at Escalation 6.)

**Escalation 6, his idea:**

> **One More Arrow** · Escalation 6 · Passive
> *By now your hands move faster than you can think: there is always one more arrow in the air.*
> **Passive:** Once on each of your turns, a [Strike] Action of yours that deals [W] deals 1[W] more.

1[W] with a Shortbow is 4.2 to 5.2, on the 72% of Strikes that reach Tier 2: about 3.4 damage, about 12 points a turn, at Escalation 6 only (round 6, or earlier with Momentum and the hook). It is the class's line in one sentence, simpler than a fourth Strike, and it adds no roll.

**The ladder now:**

| Rung | One | The other |
|---|---|---|
| Escalation 2 (level 1) | **Lean and Loose** (decided) | **Blade and Bow** (decided) |
| Escalation 4 (level 2) | **Clear Lines** (checked: stays) | **Opening Shot** (his version, gated on a Tier 3: for his word) |
| Escalation 6 (level 3) | **One More Arrow** (his idea, written) | a 0 AP Encounter Action: one arrow into every enemy near him, on the run (to design) |

**Lucas's answer (2026-11-16): "All good, proceed." DECIDED: Clear Lines (Escalation 4), Opening Shot gated on a Tier 3 (Escalation 4), One More Arrow (Escalation 6), as written above.** Five of the six Escalation abilities are done.

## Decision 12: the sixth Escalation ability and the Escalation hook (PROPOSED 2026-11-16, waiting for Lucas)

**Rules first.** An ability with traits, an Area or a roll is written as a 0 AP Action with an Escalation on its bar, as the Paladin's Reckoning (Chapter 5). Several Targets: one roll, each creature its own Tier. A 2 Emanation around him is 21 squares. An [Area] Action ignores Senses; his bow is still Doomed while he is Engaged. The hook is a level 2 Feature: once an encounter, a moment raises his Escalation by 1 (the Paladin's: an ally becomes Bloodied or goes Down; the old Archer's, "your Marked Quarry goes Down", left with the quarry).

> **Arrow Storm** · Escalation 6 · Encounter · 0 AP
> *You run through the thick of it loosing as you go, and every foe near your path wears an arrow.*
> Weapon · Ranged · Projectile · Area · Self · Strike
> Area: 2 Emanation | Target: All enemies in the Area
> **Setup:** You Advance.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod].

```
Damage 5.2 a creature; about 2.3 creatures in a 2 Emanation ... 41   [SIM: 3.4 a point; the count is judgment]
A full Advance inside it, for 0 AP ... 12
--- Total: about 53, once an encounter, at Escalation 6 (One More Arrow: 12 a turn for the one or two turns a fight has at 6)
```

**Analysis.**
- **It is Strafe grown up:** the same small hit, on everyone around him instead of three, for no AP. Width, never one big hit. Reckoning's shape (a Setup Advance, an Emanation from him, 0 AP).
- **The danger is the point:** to catch several enemies in 2 squares he runs in among them, where his bow is Doomed if he ends adjacent to one. He has to end the Advance near but not next to them, or accept it. The fragile class's one brave moment.
- **Against One More Arrow:** a burst of width once, or depth every turn at 6.
- **Rules it touches:** nothing new. One roll for all of them.

> **Thrill of the Kill** · Passive (the hook, level 2)
> *One of yours drops, and your blood is up.*
> **Passive:** Once an encounter, when an enemy you have damaged goes Down, your Escalation increases by 1.

**Analysis.**
- **Why this moment:** he spreads small hits across the field, so the first enemy to fall is usually one he has tagged. The hook pays the class for hitting many, and it works with the party's kills, not only his own: teamwork again.
- **When it fires:** usually round 2 or 3, like the Paladin's.
- **The name is the old hook's** (the old one needed the quarry).
- **Other moments the rules offer, and why not:** *he gets a Tier 3* (round 1, almost always: too easy); *an enemy would enter a square adjacent to him* (it rewards being caught); *he damages three creatures in one turn* (only Strafe does it); *he hits with a blade and a bow in one turn* (only the switch-hitter); *he becomes Bloodied* (a fragile class shouldn't want that).

**For Lucas to choose:** Arrow Storm's size (a 2 Emanation; 3 is 37 squares and about one more creature); the hook's moment.

**Lucas's answer (2026-11-16): "Arrow Storm: I think this isnt on the same level as one more arrow. Either a passive or something more thematic would fit, this is Arts after all".** ARROW STORM IS OUT. (Read as: the sixth ability should be a Passive like its partner, or something with more of the class in it than another damage Action. The hook was not answered yet.)

**Three Passives for the place, each at One More Arrow's size (about 12 a turn at Escalation 6):**

> **Spare Arrow** · Escalation 6 · Passive (width, where One More Arrow is depth)
> *You always have a second arrow between your fingers, and it always finds someone.*
> **Passive:** Once on each of your turns, when you damage a creature with a [Ranged, Strike] Action, another enemy within 3 squares of it that you have Line of Effect to takes [V] damage equal to 2 + your Weapon Modifier, of your weapon's subtype.

4 damage with no roll, on nearly every turn an enemy has a neighbor: about 12 to 13 points [SIM: 3.4 a point]. **It is One More Arrow's mirror:** the pair repeats the Hallmark choice (Quick Shots' depth, Strafe's width), so a rung's two abilities are the same size by construction. No roll, no dice.

> **Fleet** · Escalation 6 · Passive (the mobility)
> *Nothing on this field is as fast as you are now.*
> **Passive:** Each Evade of yours moves you 1 more square, and your Evades can enter Difficult Terrain.

"Very mobile", as its last word: Quick Shots' Evade 2 becomes 3, Sidestep's 3 becomes 4, Slip Away's first step becomes 2. About 8 to 12 a turn [judgment]. It gives no damage at all, so it is the choice for the Archer who wants never to be caught.

> **Blood Up** · Escalation 6 · Passive (the kill)
> *Each foe that falls only makes your hands quicker.*
> **Passive:** Once a round, when an enemy you have damaged goes Down, you gain 1 AP. You can keep it for your next turn if it isn't yours.

A whole extra Action in the rounds something he tagged dies (about half the rounds late in a fight): about 6 to 12 a turn [judgment: an AP is 12]. Teamwork again (the party's kills count). It needs a line for an AP gained outside his turn.

**Claude's pick: Spare Arrow.** It answers "the same level" exactly (the same sentence shape and size as One More Arrow, the other axis), and it is the brief's first line: many hits, never one big one.

**Lucas's answer (2026-11-16): "Fleet is good. Thrill of the kill is good as well." DECIDED: Fleet (Escalation 6) and the hook Thrill of the Kill.**

## The Escalation abilities and the hook: all decided

| Rung (level) | One | The other |
|---|---|---|
| Escalation 2 (level 1) | **Lean and Loose:** The Leaning Action costs you 0 AP. | **Blade and Bow:** Once on each of your turns, when you use a [Melee, Strike] Action after a [Ranged, Strike] Action, or a [Ranged, Strike] Action after a [Melee, Strike] Action, it gains 1 Boon. |
| Escalation 4 (level 2) | **Clear Lines:** Your allies give your targets no Cover, and your [Ranged] Actions take no Field Bane for a target Engaged with one of your allies. | **Opening Shot:** Once a round, when you get a Tier 3 with a [Ranged, Strike] Action against a creature, one ally who threatens it can spend 1R to make a Weapon Attack (1A) against it. |
| Escalation 6 (level 3) | **One More Arrow:** Once on each of your turns, a [Strike] Action of yours that deals [W] deals 1[W] more. | **Fleet:** Each Evade of yours moves you 1 more square, and your Evades can enter Difficult Terrain. |

**The hook (level 2), Thrill of the Kill:** Once an encounter, when an enemy you have damaged goes Down, your Escalation increases by 1.

## Decision 13: the Encounter Picks, their themes first (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** Level 2 gives one Encounter Pick of three. An Encounter Action is worth double its AP (2 AP: 100 points) and can carry two riders (the charter). The brief: no big single hit. Hazardous Terrain is written [HT: Entering, Turn, Movement] in the effect that makes an area, and a creature takes it once a Movement (Chapter 3). Today's five: Marksman's Shot (a big hit: out), Volley (an Area with odd Tiers), Covering Fire (a zone of a Bane and +1 Defense: silent bonuses), Pinning Shot (Immobilized: Trick Shots' Pin does the small version), Twin Shot. Research: the shooter's burst that was liked is width and never-whiff, not a multiplier; reload and standing still can be a price.

| Theme | The card in one line | Its kind |
|---|---|---|
| **1. The volley** | arrows fall on an area: every creature in it takes a small hit, by its own Tier; the wide version of Strafe, placed at a distance | width, at range: the Archer's "big moment" without a big number |
| **2. The running fight** | he runs the length of the field, and each enemy he passes within Reach takes the knife: one roll, a small hit each, then he is out the other side | the switch-hitter's turn: mobility and the blade together |
| **3. The pinning rain** | for a round his arrows keep falling on a patch of ground: it is Hazardous Terrain for enemies ([HT: Entering, Movement]), a small hit each time one crosses it | area denial for the party: many small hits made by the enemies' own choices |

**Claude's note:** all three are many small hits and none is a nova; 1 is a shot, 2 is a move, 3 is ground held, so the pick says how he likes to fight. Left out: a duelist's single-target Encounter (it would be the big hit), a healing or shielding card (the brief has no support).

**Lucas's answer (2026-11-16): "Yes, its good, though running fight we have to mix bow with light weapon somehow." THE THREE THEMES ARE DECIDED** (the volley, the running fight, the pinning rain); the running fight must use both the bow and the Light weapon.

## Decision 14: the first Encounter Pick, Volley (PROPOSED 2026-11-16, waiting for Lucas)

**Rules and research first.** Today's Volley: Encounter, 2 AP, a [Save, Weapon] Area (each creature rolls an Instinct Save), a 2 Emanation placed within the weapon's normal range, all creatures in it: 2d8 + [Mod] and Hindered / 1d10 + [Mod] / 1d4. Several Targets: his one roll is read against each creature's Defense, and each gets its own Tier (a Save would be one roll a creature, by the GM). A 2 Emanation is 21 squares; the ruler assumes 1.8 creatures in one, more when it is placed with care. An Encounter Action of 2 AP is worth 100 points. Research: the liked burst for a shooter is width and never-whiff.

> **Volley** · Encounter · 2 AP
> *You send a flight of arrows high, and they come down on everything standing in one patch of ground.*
> Weapon · Ranged · Projectile · Area · Strike
> Distance: Weapon · Area: 2 Emanation | Target: All creatures in the Area
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 2[W] + [Mod].
> **Tier 3:** [V] 3[W] + [Mod].
> **Effect:** You Evade 2.

```
Damage 2 / 10.4 / 17.6 = 9.6 a creature; about 2.5 creatures (placed with care) ... 81   [SIM: 3.4 a point; the count is judgment]
Effect: Evade 2 ... 8   [judgment]
--- Total: about 89, of 100: a little under (it never whiffs; against four packed enemies it is 130)
```

**Analysis.**
- **It is Quick Shots on everyone in a patch of ground:** the class's own hits-by-Tier, once an encounter, wide. No creature takes more than Quick Shots would give it, so there is no big hit; the size is in the count.
- **The decision it gives:** when the enemies are bunched, and whether an ally is in the patch: it hits **all creatures**, as today's Volley does, so the front line and the Archer have to talk (teamwork by not standing there). With "all enemies" it would be simpler and about 10% stronger: his call.
- **His roll, not their Saves:** one roll at the table instead of one a creature. Today's version was a Save.
- **Shoot, then move:** the Evade is the class's signature, and sets up Shifting Aim for the next shot.
- **Rules it touches:** nothing new.
- **Against the other two Picks (to come):** this is the one taken by the Archer who stays back.

**For Lucas to choose:** all creatures or all enemies; the Area (a 2 Emanation; a 3 Emanation is 37 squares and would need smaller Tiers).

**Lucas's answer (2026-11-16):** "It should be a burst, instead of emanation"; then: "Do with 3 burst, all creatures, and see how it would look with hindered eot on Tier 3." (A 2 Burst is 12 squares, a 3 Burst 32, a 2 Emanation 21; the ruler assumes 1.8 creatures in a 2 Burst and 2.3 in a 3 Burst.)

> **Volley** · Encounter · 2 AP
> *You send a flight of arrows high, and they come down on everything standing in one patch of ground.*
> Weapon · Ranged · Projectile · Area · Strike
> Distance: Weapon · Area: 3 Burst | Target: All creatures in the Area
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 2[W] + [Mod].
> **Tier 3:** [V] 3[W] + [Mod]; Hindered (EoT).
> **Effect:** You Evade 2.

```
Damage 9.6 a creature; 2.3 creatures in a 3 Burst ... 75   [SIM: 3.4 a point; the ruler's count for a 3 Burst]
Hindered (EoT) on a Tier 3: 21% of the creatures, a Mild rider ... about 1.5   [Lucas's rider table: Mild 3]
Effect: Evade 2 ... 8   [judgment]
--- Total: about 85, of 100: a little under
```

**How Hindered on Tier 3 looks:** it is light. One creature in five gets it, and only until its own turn ends, so it slows that creature's next move (half Speed). It costs almost nothing in points and gives the top Tier something to say beyond more damage; it won't hold a group. If it should matter, "Tier 2 or 3" would catch 72% of them (about 5 points, and then the patch of ground really slows the pack).

**He also asked (2026-11-16): "Are we underutilizing the multiple actions here? Make a quick search about it, see if we need to give more versions to Actions. Same with critical, we are likely underutilizing it."** What the project already holds: `book/research/ability-scope.md` argued *against* Versions ("the 1 / 2 / 3 AP Versions make each turn a budget problem ('biggest Smite I can afford, then attacks'), not a board problem. Two or three small, different Round options beat one card in three sizes"), which is why the redesign has so few (2 of the Paladin's 19 cards, none of the Archer's; the old book: 16 of 62). A Critical (Doubles on a result already Tier 3) comes up on 2.8% of rolls at Weapon +2 against DC 13 (2.1% at +1): about once in 36 rolls, perhaps once every third fight for an Archer; 3 of the old 62 cards had a Critical line, none of the redesign's. A web search on both is running; the note goes to `book/research/`.

**The search is back (`book/research/versions-criticals.md`; one quick pass). Claude's answer to both: we are using them less on purpose, and the research supports it, with one thing worth adding for the Critical.**

- **Versions: not underused.** Where Versions differ only in size, players use one and ignore the rest ("our wizard never casts anything but three-action magic missiles"; 4e's augments the same). The ones that read as a choice differ in kind (Pathfinder 2e's Heal: touch, range, area). Ours are of that kind where we have them (Judge, Lay On Hands), and **the Arts' Modes are the same idea at one cost**. A shared second cost kills the cheap Version, and Frequency is ours: an Encounter card with a cheap Version would almost never be used cheap. **Rule to keep: a second Version only when it does a different thing, never a bigger one.** A candidate on the Archer, if he wants one: Darting Blade at 2 AP reaching a creature within a short Advance (a different use: the dash in), but the class already has a lot of movement.
- **Criticals: a line a card is the wrong place at 2.8%.** Games with criticals that rare (Draw Steel: 3%) write the critical **once, for everything, and big** ("lets you immediately take an additional main action"), and put each ability's excitement on a result that comes often (its tier 3). Mearls on why a rare critical can carry a lot: "it only happens 1 in 20... let's throw a lot of effects there." We already do the first half (a Critical raises Escalation by 1, once an encounter) and the redesign does the second (a Tier 3 must visibly beat a Tier 2). **What is worth adding: one Critical line a class, on a Feature, not one a card.** For the Archer, something like "When you get a Critical with a [Strike] Action, you can make a Weapon Attack (1A) against any creature in range" (one more arrow, the class in a line); for the Paladin, its own. Rare, loud, and nothing to read on every card.

**Lucas's answer (2026-11-16): "Some actions can just have its own critical entry, to be unique." "Tier 2 and 3 is good then."** So: **no Critical line a class; a few cards get their own Critical entry** (the Structure keeps the line, optional, under Tier 3), chosen when the class is read whole. **VOLLEY IS DECIDED:**

> **Volley** · Encounter · 2 AP
> *You send a flight of arrows high, and they come down on everything standing in one patch of ground.*
> Weapon · Ranged · Projectile · Area · Strike
> Distance: Weapon · Area: 3 Burst | Target: All creatures in the Area
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod] Pi.
> **Tier 2:** [V] 2[W] + [Mod]; Hindered (EoT).
> **Tier 3:** [V] 3[W] + [Mod]; Hindered (EoT).
> **Effect:** You Evade 2.

About 88, of 100 (damage 75, Hindered on 72% of the creatures about 5, the Evade 8).

**Versions: kept as they are** (a second Version only when it does a different thing).

## Decision 15: the second Encounter Pick, Hit and Run (PROPOSED 2026-11-16, waiting for Lucas)

Lucas: the running fight has "to mix bow with light weapon somehow".

**Rules first.** Several Targets: one roll, read against each creature, each its own Tier. A Setup happens first and the targets are chosen after it. Using a [Ranged] Action while Engaged is Doomed (each target has its own Boons, Banes, Favored and Doomed). A Dagger's [W] is 0 / 2 + 1d4! / 4 + 1d4!; a Shortbow's 0 / 1d6! / 1 + 1d6!. Swapping weapons is an Interact (1 AP) unless a card says otherwise (Darting Blade does). An Encounter Action of 2 AP is worth 100 points.

> **Hit and Run** · Encounter · 2 AP
> *You sprint into the thick of them: the knife opens whoever is in reach, an arrow finds one more, and you are out the far side before they turn.*
> Weapon · Melee · Ranged · Projectile · Strike
> Target: Each enemy within your Reach, and one other creature within your bow's Range
> **Setup:** You Advance.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 2[W] + [Mod].
> **Effect:** You Evade 3.
> **Special:** [W] is your Light weapon's against the enemies within your Reach and your bow's against the other creature. You draw and stow both as part of this Action, and the arrow isn't Doomed for your being Engaged.

```
The knife: 2 / 6.5 / 15.8 = 7.2 a creature; about 2 enemies within Reach (he chooses where the Advance ends) ... 49   [SIM: 3.4 a point; the count is judgment]
The arrow: 2 / 6.2 / 12.4 = 6.3 on one more creature ... 21
Setup: a full Advance ... 12;  Effect: Evade 3 ... 12   [SIM: an AP is 12]
The free swaps and "not Doomed" ... not priced (they are what lets the card exist)
--- Total: about 94, of 100: on
```

**Analysis.**
- **Bow and blade in one breath:** one roll, read against everyone the knife can reach and one creature the arrow can. Not two attacks one after the other (Double Shot's shape), and neither weapon is decoration: the knife pays for the risk of running in, the arrow reaches the one who stayed back.
- **The decision it gives:** where the Advance ends. More enemies within Reach is more knife; each of them is also next to him if a Tier 1 comes up. Then Evade 3 takes him out, through the gap he planned.
- **The fragile class's brave card,** as Arrow Storm was meant to be, but by his own two weapons instead of a spray.
- **Rules it touches:** a card with two weapons needs to say which [W] is whose (the Special line); "not Doomed" is a stated exception (specific beats general). The targets are chosen after the Setup, as the Setup rule says.
- **With the rest:** Blade and Bow's Boon doesn't apply (it is one Action); Fleet makes its Evade 4; Shifting Aim's Boon applies (he left his square in the Setup).
- **Complexity:** the longest card of the class (a Setup, an Effect and a Special): an Encounter Pick's place.

**For Lucas to choose:** the shape (one roll for knife and arrow); the Evade (3); the name.

**Lucas's answer (2026-11-16): "I think it could be better."** His draft: "Hit and Run; Weapon · Projectile · Strike; You Advance, and after each square moved during this Advance, you can make [Melee] Weapon Attack (1AP) with a Light weapon against each creature you moved adjacent to that you haven't attacked yet. You can also make one [Ranged] Weapon Attack at any point during it. You can swap to a Light weapon or a Projectile weapon before each Weapon Attack." And: "I think it can still be better and the way I wrote it might be too strong."

**His draft, checked.**
- **It is better than mine in two ways.** The knife goes to every enemy along the run, not only those around where he stops, so the path is the play. And the arrow "at any point" lets him shoot before he is next to anyone, so the Doomed-while-Engaged rule needs no exception.
- **Not too strong.** A Weapon Attack with a Dagger at Weapon +2 averages 5.5; with 3 enemies passed and the arrow (4.7) it is about 21 damage: 72 points, + 12 for the Advance: **about 84, of 100.** With 2 enemies about 65; with 4, about 103; with 5 (rare in 6 squares), about 120. The Advance can trigger Reactions, and each square next to an enemy is a place to be stopped.
- **Its problem is the dice, not the power:** each Weapon Attack (1A) is its own 2d12 roll, so a good run is four or five rolls in a row: Double Shot's boredom, longer. And a Weapon Attack does nothing on a Tier 1, so some of the stabs simply miss, which is not the class.
- **Small things:** "each creature" would stab allies he runs past; the Advance makes it a Move Action; a Linked Action keeps its own traits, so the card needn't carry Melee or Ranged.

**The same card with one roll and the class's floor:**

> **Hit and Run** · Encounter · 2 AP
> *You run the length of the fight with the knife out, opening every foe you pass, and somewhere along the way an arrow leaves your bow.*
> Weapon · Projectile · Move · Strike
> **Effect:** You Advance. After each square of this Advance, you hit each enemy adjacent to you that this Action hasn't hit yet with a Light weapon. Once, at any point of the Advance, you hit one creature within your bow's Range with your bow. You draw and stow the two weapons freely during this Action.
> **Attack:** Weapon vs. Armor Defense. Roll once, when the first creature is hit: every hit of this Action uses that roll.
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod].
> **Special:** [W] is the weapon that hit. The bow's hit is Doomed if you are Engaged when you make it.

```
The knife: 2 / 7 / 9 = 6 a creature; about 3 enemies passed in a 6-square Advance ... 61   [SIM: 3.4 a point; the count is judgment]
The arrow: 2 / 6.2 / 7.2 = 5.2 ... 18
The Advance itself ... 12
--- Total: about 91, of 100: on (2 enemies: about 71; 4: about 112)
```

**What changed from his draft, and why:** (1) **one roll** for the whole run, read against each creature's Defense as he reaches it (Several Targets' way), made when the first is hit, so the table rolls once and he still commits to the path before he knows; (2) **Tier 1 deals [Mod]**, so no stab is a whiff; (3) "each enemy"; (4) the Move trait; (5) the last Special sentence only restates the Engaged rule, so nobody has to remember it mid-run.
**What it keeps:** his whole idea: the run is the weapon, the knife along the path, one arrow whenever he likes, free swaps.
**To watch:** with one roll the whole card rises or falls together (a Tier 3 run is 9 on each of four creatures; a Tier 1 run is 2 on each). The floor is what makes that acceptable; if it feels too swingy, the alternative is his separate rolls with the floor.

**Lucas's answer (2026-11-16): "Tier 3 should get something, otherwise we have the problem of T3 feeling underwhelming."** One roll and the floor were not objected to.

**Every candidate for Hit and Run's Tier 3** (the Tier applies to every creature the run hit, so whatever it adds lands on all of them):

| Tier 3 adds | What it does | For | Against |
|---|---|---|---|
| **Vulnerable 1 (EoT)** | every Action against each creature he hit has 1 Boon until that creature's turn ends | his "distract... maybe causing vulnerable"; the party cashes it: teamwork; a run that opens three enemies at once is a moment | Startle (Trick Shots) is the same rider on one creature |
| Hindered (EoT) | they are slowed for their next move | he gets away clean | already Volley's and Snap Shot's rider |
| 2[W] + [Mod] | about 7 more damage on each | simple | 16 on each of three or four creatures is the big hit the brief rules out |
| "then you Evade 3" | he gets out the far side | the fragile class escaping | it rewards him, not the hit; Tier 3 should be about the enemies |
| Pushed 1 | each is knocked a square from him | opens his way | fiddly: one Forced Movement a creature, in mid-run |
| Prone | they are down | strong | Severe on every creature at once: too much |

**Proposed: Vulnerable 1 (EoT).**

> **Tier 3:** [V] 1[W] + [Mod]; Vulnerable 1 (EoT).

About 6 points a creature on the 21% of runs that reach Tier 3: + 4. **Hit and Run: about 95, of 100.**

**His point reaches three decided cards too:** Darting Blade, Strafe and Snap Shot write the same line for Tier 2 and Tier 3, and beat it only by the weapon's own Tier 3 damage (a Shortbow: 1 more; a Dagger: 2 more), as the Weapon Attack does. To look at when the class is read whole, with the Critical entries.

**Lucas's answer (2026-11-16): "Yes, it is good." HIT AND RUN IS DECIDED** (his design; one roll made when the first creature is hit; Tier 1 [Mod]; Tier 3 adds Vulnerable 1 (EoT)):

> **Hit and Run** · Encounter · 2 AP
> *You run the length of the fight with the knife out, opening every foe you pass, and somewhere along the way an arrow leaves your bow.*
> Weapon · Projectile · Move · Strike
> **Effect:** You Advance. After each square of this Advance, you hit each enemy adjacent to you that this Action hasn't hit yet with a Light weapon. Once, at any point of the Advance, you hit one creature within your bow's Range with your bow. You draw and stow the two weapons freely during this Action.
> **Attack:** Weapon vs. Armor Defense. Roll once, when the first creature is hit: every hit of this Action uses that roll.
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod]; Vulnerable 1 (EoT).
> **Special:** [W] is the weapon that hit. The bow's hit is Doomed if you are Engaged when you make it.

## Decision 16: the third Encounter Pick, Covering Fire (PROPOSED 2026-11-16, waiting for Lucas)

The theme: the pinning rain, ground held for the party.

**Rules and research first.** Hazardous Terrain (Chapter 3): written **[HT: ...]** in the effect that makes the area, with its patterns: **Entering** (a creature in the area when it appears counts as entering), **Turn** (it ends its turn there), **Movement** (it moves within it: once a Movement). Entering and Turn together hit a creature at most once a turn-cycle; Movement is apart from that limit. Difficult Terrain doubles a square's cost. A lasting area is written "for N rounds" (rounds count at the end of his turn). A 3 Burst is 32 squares. The Paladin's Consecrated Ground is the model for a zone (Difficult Terrain for enemies, 3 rounds, no roll). Today's Covering Fire: for 3 rounds enemies in the area take 1 Bane on Strikes and allies gain +1 Defense (silent bonuses: out). The SIM on zones: "a Zone works only for who stays in it"; this one works on whoever crosses it.

> **Covering Fire** · Encounter · 2 AP
> *You keep the arrows coming down on one stretch of ground, and nobody crosses it without paying.*
> Weapon · Ranged · Projectile · Area
> Distance: Weapon · Area: 3 Burst
> **Effect:** For 2 rounds, the Area is Difficult Terrain for enemies, and Hazardous Terrain for enemies [HT: Entering, Turn, Movement]: [V] damage equal to 2 + your Weapon Modifier, of your weapon's subtype.

```
4 damage to each enemy in the Area when it is placed: 2.3 enemies ... 31   [SIM: 3.4 a point; the ruler's count for a 3 Burst]
4 more each time one of them moves in it or ends its turn in it, for 2 rounds: about 2.3 enemies, about 60% still there, about 1.3 hits a round ... about 48   [judgment]
Difficult Terrain for enemies over 32 squares, 2 rounds ... not priced (suggested 10 to 20, as Consecrated Ground)
--- Total: about 80 to 100, of 100: on, if the enemies have a reason to be there
```

**Analysis.**
- **Many small hits made by the enemies' own choices:** 4 when it lands, 4 for each Movement inside it, 4 for ending a turn in it. No roll at all: the steadiest damage in the class, and none of it big.
- **The decision it gives:** which ground matters. A doorway, the lane to the back line, the square around an ally in trouble. The enemies then choose: pay to cross, go around, or stand still and pay at the end of the turn.
- **It is his protection of the party, the Archer's way:** not a shield but ground the enemy doesn't want. With the Paladin's Consecrated Ground on the same squares, crossing costs double movement twice over and 4 damage a Movement.
- **Enemies only:** his allies fight in it freely (teamwork: the front line can stand in the rain).
- **Not a Strike:** it makes no attack roll, so it doesn't count toward his 3 Strikes, and takes no Boon from Shifting Aim.
- **Rules it touches:** [HT] with its three patterns, as the book writes it. "For 2 rounds" on an Encounter card.
- **Fiction:** he keeps loosing into that ground between his other shots; it costs him nothing after the 2 AP.

**For Lucas to choose:** the damage (4 flat; or his weapon's die); the rounds (2; 3 would be about 30% more); the Area (3 Burst, as Volley); the name (today's Covering Fire, kept).

**Lucas's answer (2026-11-16):** "Shouldnt the target be 'All enemies in the area', and just remove the 'for enemies' twice? Or would that not be intuitive? quick search. otherwise, all is good from it". **COVERING FIRE IS DECIDED; its wording keeps "for enemies", said once.** Why: a Target line says whom the Action affects when it is used; this card makes ground that lasts 2 rounds and works on creatures that walk in later, which were never its targets (Chapter 2: only the Target line targets). With "Target: All enemies in the Area" and "the Area is Difficult Terrain", the terrain itself would read as rough for everyone. The book's own lasting areas put the side in the sentence (today's Covering Fire and Consecrated Ground: "enemies in the area...", "allies in it..."; the Paladin's new Consecrated Ground: "Difficult Terrain for enemies"), and so does the one 4e zone in our research (the Seeker's Thorn Cloud Shot: "The attack creates a zone... Any creature that ends its turn within the zone takes poison damage": the Target line is for the attack, the zone names whom it hurts). No new search was needed.

## The whole Archer, levels 1 to 3: the clean read (2026-11-16, before applying)

Every card in its final text. **Numbers:** Weapon +2 · Power +1 (fixed) · Health 16 / 8 · Rally 5 · Speed +1 · Light armor · Attributes: Body or Instinct +1, Mind or Appeal +1. **A line ending in * is new here and waits for his word** (the Tier 3 lines he asked for, and the Critical entries).

### Level 1: the two Features

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
> **Tier 3:** [V] 1[W] + [Mod]; Staggered (EoT).
> **Effect:** You Evade 2, then can stow that weapon and draw your bow.

### Level 1: a Hallmark Action (1 of 2)

> **Quick Shots** · Round · 2 AP
> *You loose arrow after arrow into one foe before the first has landed, and step away while it reels.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One creature
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 2[W] + [Mod].
> **Tier 3:** [V] 3[W] + [Mod].
> **Critical:** You regain 1 AP.
> **Effect:** You Evade 2.

> **Strafe** · Round · 2 AP
> *You run across the line of fight and put an arrow into each foe you pass.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: Up to three creatures
> **Setup:** You Advance.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod]; Pushed 1.

### Level 1: a Hallmark Reaction (1 of 2)

> **Slip Away** · Turn · 1R
> *The moment a foe commits to reaching you, you are already somewhere else.*
> Distance: 5 sq. | Target: One enemy
> **Interrupt:** The target would enter a square adjacent to you.
> **Effect:** You Evade 1, then Advance 2.

> **Snap Shot** · Turn · 1R
> *A foe lunges for you, and you put an arrow in it before it has finished the step.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One enemy
> **Interrupt:** The target would enter a square adjacent to you.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod]; Hindered (EoT).
> **Tier 3:** [V] 1[W] + [Mod]; Immobilized (EoT).

### Level 1: an Art (1 of 3; a second at level 3)

> **Footwork** · Round · 1 AP
> *You are never where you were a breath ago: a long sidestep, a run through the press, or a step with your hands already busy.*
> — **Sidestep** —
> **Effect:** You Evade 3.
> — **Weave · Move** —
> **Effect:** You Advance. During this Advance, Difficult Terrain doesn't slow you, and you can move through the squares of unwilling creatures (you can't end in one).
> — **Hands Busy** —
> **Effect:** You Evade 1, and before or after it you use the Interact or Reload Action (1A).

> **Trick Shots** · Round · 1 AP
> *You put the arrow where it will do something other than wound: through a cloak, past an ear, square on a shield.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One creature
> **Attack:** Weapon vs. Armor Defense
> — **Pin** —
> **Tier 2 or 3:** [V] [Mod]; Hindered (1 round).
> — **Startle** —
> **Tier 2 or 3:** [V] [Mod]; Vulnerable 1 (EoT).
> — **Knock Back** —
> **Tier 2:** [V] [Mod]; Pushed 1.
> **Tier 3:** [V] [Mod]; Pushed 2.

> **Spotter** · Round · 1 AP
> *You read the field the way others read a page: where a foe hides, where the gap in its cover is, where you yourself are hardest to hit.*
> — **Call Out** —
> Distance: 10 sq. | Target: One creature you perceive
> **Effect:** Your allies perceive the target one step better than they do: Hidden as Obscured, Obscured as Clear (1 round).
> — **Find the Gap** —
> **Effect:** Your next [Ranged, Strike] Action this turn ignores the Banes of far and maximum range, and counts each target's Cover as one level lower.
> — **Keep Low** —
> **Effect:** Against each creature you have Cover from, your Cover is one level higher, up to High (1 round).

### Level 1: the Escalation 2 ability (1 of 2)

> **Lean and Loose** · Escalation 2 · Passive
> *A wall is a quiver's best friend: you are out, the arrow is gone, and you are back.*
> **Passive:** The Leaning Action costs you 0 AP.

> **Blade and Bow** · Escalation 2 · Passive
> *Arrow, knife, arrow: each sets up the next.*
> **Passive:** Once on each of your turns, when you use a [Melee, Strike] Action after a [Ranged, Strike] Action, or a [Ranged, Strike] Action after a [Melee, Strike] Action, it gains 1 Boon.

### Level 2: the hook

> **Thrill of the Kill** · Passive
> *One of yours drops, and your blood is up.*
> **Passive:** Once an encounter, when an enemy you have damaged goes Down, your Escalation increases by 1.

### Level 2: an Encounter Pick (1 of 3)

> **Volley** · Encounter · 2 AP
> *You send a flight of arrows high, and they come down on everything standing in one patch of ground.*
> Weapon · Ranged · Projectile · Area · Strike
> Distance: Weapon · Area: 3 Burst | Target: All creatures in the Area
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 2[W] + [Mod]; Hindered (EoT).
> **Tier 3:** [V] 3[W] + [Mod]; Hindered (EoT).
> **Critical:** The target is Prone.
> **Effect:** You Evade 2.

> **Hit and Run** · Encounter · 2 AP
> *You run the length of the fight with the knife out, opening every foe you pass, and somewhere along the way an arrow leaves your bow.*
> Weapon · Projectile · Move · Strike
> Target: Each enemy adjacent to you at any point of the Advance, and one creature within your bow's Range
> **Effect:** You Advance. After each square of this Advance, you hit each enemy adjacent to you that this Action hasn't hit yet with a Light weapon. Once, at any point of the Advance, you hit one creature within your bow's Range with your bow. You draw and stow the two weapons freely during this Action.
> **Attack:** Weapon vs. Armor Defense. Roll once, when the first creature is hit: every hit of this Action uses that roll.
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod]; Vulnerable 1 (EoT).
> **Special:** [W] is the weapon that hit. The bow's hit is Doomed if you are Engaged when you make it.

> **Covering Fire** · Encounter · 2 AP
> *You keep the arrows coming down on one stretch of ground, and nobody crosses it without paying.*
> Weapon · Ranged · Projectile · Area
> Distance: Weapon · Area: 3 Burst
> **Effect:** For 2 rounds, the Area is Difficult Terrain and Hazardous Terrain for enemies [HT: Entering, Turn, Movement]: [V] damage equal to 2 + your Weapon Modifier, of your weapon's subtype.

### Level 2: the Escalation 4 ability (1 of 2)

> **Clear Lines** · Escalation 4 · Passive
> *Your friends have learned where not to stand, and you have learned to shoot past their ears.*
> **Passive:** Your allies give your targets no Cover, and your [Ranged] Actions take no Field Bane for a target Engaged with one of your allies.

> **Opening Shot** · Escalation 4 · Passive
> *Your arrow staggers the foe, and your ally's blade is already coming.*
> **Passive:** Once a round, when you get a Tier 3 with a [Ranged, Strike] Action against a creature, one ally who threatens it can spend 1R to make a Weapon Attack (1A) against it.

### Level 3: the Escalation 6 ability (1 of 2), and a second Art

> **One More Arrow** · Escalation 6 · Passive
> *By now your hands move faster than you can think: there is always one more arrow in the air.*
> **Passive:** Once on each of your turns, a [Strike] Action of yours that deals [W] deals 1[W] more.

> **Fleet** · Escalation 6 · Passive
> *Nothing on this field is as fast as you are now.*
> **Passive:** Each Evade of yours moves you 1 more square, and your Evades can enter Difficult Terrain.

**New on this page, for Lucas (the lines marked *):**

1. **Darting Blade, Tier 3:** Staggered (EoT): the creature can't use Reactions until its turn ends. "Gone before it turns", made a rule; no other card of his uses it.
2. **Strafe, Tier 3:** Pushed 1: the arrow knocks each of them a square back from him.
3. **Snap Shot, Tier 3:** Immobilized (EoT) where Tier 2 is Hindered: the lunge stops dead, and it doesn't reach him.
4. **Quick Shots, Critical:** "You regain 1 AP." The class's own critical: the hands were faster than the turn.
5. **Volley, Critical:** "The target is Prone." Each creature its own, as Several Targets reads a Critical.

**Seen together:**

- **One wording changed without changing the card:** Covering Fire says "for enemies" once ("the Area is Difficult Terrain and Hazardous Terrain for enemies").
- **His turn has 4 AP and 3 Strikes.** A full turn: a Hallmark (2 AP), then two of Darting Blade, an Art, a Weapon Attack or a move.
- **Who moves him:** Quick Shots (Evade 2 after), Strafe (an Advance before), Darting Blade (Evade 2 after), Footwork, Slip Away, Hit and Run, Volley (Evade 2 after). Fleet adds 1 to every Evade.
- **His riders, so none repeats too often:** Hindered on Snap Shot, Volley and Pin; Vulnerable 1 on Startle and Hit and Run; Pushed on Knock Back and (new) Strafe; Staggered (new) on Darting Blade; Immobilized (new) on Snap Shot's Tier 3; Prone only on Volley's Critical.
- **Teamwork:** Clear Lines, Opening Shot, Call Out, Startle, Covering Fire, Thrill of the Kill (the party's kills count).
- **19 cards:** 2 Features, 2 Hallmark Actions, 2 Hallmark Reactions, 3 Arts, 6 Escalation abilities, the hook, 3 Encounter Actions. A character holds 9 at level 3.

**Lucas's answer (2026-11-16): "All looks good; see if any is missing Attack entry, or any other entry." THE FIVE NEW LINES ARE DECIDED** (Darting Blade's Staggered, Strafe's Pushed 1, Snap Shot's Immobilized, the Criticals of Quick Shots and Volley).

**The check of every card against the Structure (2026-11-16):**
- **The Attack line:** all seven cards with Tiers have one (Darting Blade, Quick Shots, Strafe, Snap Shot, Trick Shots, Volley, Hit and Run). No card rolls a Save. The cards with no roll have no Attack line and need none (the Passives, Slip Away, Footwork, Spotter, Covering Fire).
- **FIXED: Hit and Run had no Target line.** Its targets were only in the Effect's sentence, and Chapter 2 says only the Target line makes a creature a target. Added: "Target: Each enemy adjacent to you at any point of the Advance, and one creature within your bow's Range" (the Effect and the roll are unchanged).
- **FIXED: the Tier 1 lines were written two ways** ("[V] [Mod] Pi" on the bow cards, "[V] [Mod]" on the blade cards). All are now "[V] [Mod]" (8 lines): Chapter 1 already says the Modifier on a Weapon Action "joins the weapon's damage and keeps its damage type and subtype", so the subtype needn't be written, and a bow that isn't Pierce stays right.
- **Checked and left:** *the Move trait* is on Hit and Run and on Footwork's Weave, where the whole card or Mode is an Advance, and not on Strafe or Slip Away, where the Advance is one part: a Linked Action keeps its own traits (Chapter 2), so the Advance inside them is a Move by itself; the Paladin's Lay On Hands and Reckoning are written the same way. *Covering Fire has no Target line* on purpose (his question, answered above). *Slip Away has no traits*: nothing in it needs one. *Distance and Target* are absent only where the card or Mode affects him alone.
- **Every Reaction has its Target line and its Interrupt written about "the target".** Every Strike says its Defense.

**The whole Archer is decided. Nothing is in the book, the card files or Foundry; waiting for his word to apply.**

## A rule changed back: Line of Effect is the default (Lucas, 2026-11-16; wording PROPOSED, waiting for his word; then the book's Chapter 2 is corrected)

**Lucas:** "I am worried about the rule of 'targets on the effects dont need LoS' when we start making spells. I think Hit and Run for example suffers a lot from it. I think we should make LoS default and no-LoS exception."

**What the book says today (written with the Paladin, Chapter 2):** "Only the Target line targets... You need no Line of Effect to the triggering creature for that; perceiving it is enough", and in Targets of Effects: a creature named in the text and not on the Target line is affected by the card's words, "and the rules about targets don't apply to it". He is right about where that leads: any card that names its creatures in its text instead of on its Target line would work through walls (Hit and Run's stabs did, before its Target line was added), and a spell's "each ally within 5 squares" would too. (The book has Line of Effect, not Line of Sight: Sight itself needs Line of Effect.)

**The rule, turned around:**

> **Line of Effect, always.** Whatever a card or a feature does to a creature (damages it, moves it, heals it, gives it a condition, Guard, a Boon or a Bane, or lets it act), you need Line of Effect to that creature at that moment, whether the creature is on the Target line or named in the text. In an Area, the line is from the Point of Origin. A creature you have no Line of Effect to isn't affected; the rest of the card still happens. A card that works without it says so: "(no Line of Effect needed)".
> **A Reaction's target.** Every Reaction has a Target line, and its Interrupt or Trigger is written about **the target**. The creature whose Action sets the Reaction off is the **triggering creature**. To use a Reaction you need Line of Effect to its target, and you must perceive the target and the triggering creature (Hidden is enough; Unsensed is not).
> A feature that says "when..." waits for a moment: you must perceive the creatures it names. What it then does to a creature needs Line of Effect like anything else.

**What changes on the decided cards:**

| Card | Today | With the default |
|---|---|---|
| Shield of Faith (Paladin) | the attacker is Taunted with no Line of Effect to it | the damage is reduced (the ally is the target); the attacker is Taunted only if he has Line of Effect to it |
| Judge's reduction (Paladin) | an ally within 5 squares | he needs Line of Effect to that ally when the damage comes |
| Commandment's Courage (Paladin) | allies within 3 squares | those he has Line of Effect to |
| Opening Shot (Archer) | an ally who threatens the creature | he needs Line of Effect to that ally |
| Spotter's Call Out (Archer) | "your allies perceive the target..." | **an exception worth writing:** it is a shout: "(no Line of Effect to your allies needed)" |
| Hit and Run (Archer) | fixed already by its Target line | each hit needs Line of Effect at that square: no stab through a wall |
| Kindled Wrath, Thrill of the Kill | they do nothing to another creature | unchanged: he only has to perceive |
| Bulwark of Faith, Rebuke, Slip Away, Snap Shot, Lay On Hands | their one creature is the target | unchanged |

**In the book when he says yes:** Chapter 2, "A Reaction's Target" (the "Only the Target line targets" paragraph and its first example: the attacker out of Line of Effect is not Taunted) and "Targets of Effects" (its last paragraph); Chapter 3, "Line of Effect" (its first sentence speaks only of targets: "To target a creature with an Action, you need Line of Effect"; it becomes "to affect"); the Glossary.

**Lucas's answer:**

