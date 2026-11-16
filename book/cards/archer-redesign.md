# The Archer's redesign: the record

**Started 2026-11-16 (Lucas: "Start the Archer"), on branch `pack-paladin-redesign`, after the Paladin was applied to the book.** The same way as the Paladin (`paladin-redesign.md`): his brief, research, then one decision at a time (the class's numbers, the two Features, the Hallmark Actions and Reactions, the three Arts, the six Escalation abilities, the hook, the three Encounter Picks), each card in the analysis format, in the card Structure (`card-structure.md`). **Nothing goes into the book, the card files or Foundry until he says so.** The cards, when applied, go to `book/cards/stage0/archer.json`.

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

**Lucas's answer:**
