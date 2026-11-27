# Is the action economy too loose, and what would "4 AP, no Reaction Point" do

**Date:** 2026-11-27. **Asked by Lucas:** "I think the underlying problem is the Action system. 4 + 1R makes decisions of using action essentially meaningless, since you have already so much you can do in a turn. Rarely you get the feel of 'should I use this or that?' I think the Action Economy itself is broken and makes it not satisfying. I thought of it, maybe making actions take more AP but that is just a bandaid to a bigger issue. I have been running away from 3AP + 1R because thats literally PF2e, but what about 4 Actions? No R. This makes choices more meaningful and you choose if you keep a reaction or not. This could bring back Arts easily since you wont have too much of 'I already use most of my good actions, now its just filler'. Though I am not sure if its just overthinking or if it makes sense. Check the action rules, compare to other systems we have researched, see if my doubt (about Action economy being 'broken' and not 'limiting' enough) then ponder about changing it to 4AP (no free R)."

**What was read, and how far to trust it.** One researcher, one pass. Every web page was read through a summarizing reader: a quote marked [checked] was returned from its page by that reader, not read by eye, so **check a quote on its page before repeating it.** A search tool's summary of a page nobody opened is a [lead]; what Claude knows without a page is [memory]; Claude's own arithmetic is [mine]. Parts A and D are Claude's reasoning on 2d12's rules, cards and three playtest logs; each point is marked [arithmetic], [from the rules], [from the playtests] or [judgment]. The arithmetic is exact dice math on the cards as written (the roll code of `book/ruler/benchmark.mjs`, Armor Defense 13), not a simulation: no map, no movement, no Cover. **DC20's rulebook could not be opened** (a paid beta; the copies refused the reader): what is said of it is the publisher's product page and leads. Not opened either: Paizo's own blog and forums, Giant in the Playground, Reddit, RPG.net (section 6).

**Other games' rules and opinions, and Claude's arithmetic on playtest values, never 2d12's rules. Nothing here is decided.**

**The short answer.** His doubt is right about the symptom and half right about the cause. The turn does not hold too many AP; **its last AP have a default that is nearly as good as the first**: a second Basic Attack keeps 92% of the first one's damage and a third 84%, where Pathfinder 2e's second attack keeps about 55% and its third 10 to 20%. Nothing else a single AP buys comes near it. Taking the Reaction Point away does not change that number, so at today's prices "4 AP, no Reaction Point" makes most PCs attack with all four AP and lets the Paladin's Reactions drop out of play. With a real brake on the repeated attack, the same change (or the Reaction Point kept) gives the choice he is missing.

---

## 1. What our research and the rules already held

No file here was about the action economy. These touch it:

- **`ability-scope.md`** (2026-11-14), takeaway 5: "Rote turns come from one best default"; the fix writers offer most is a few simple everyday options with different effects, each usable every turn. Takeaway 6: Draw Steel keeps "a separate small economy for small things" (maneuvers, triggered actions).
- **`archer.md`** (2026-11-16), takeaway 1: "What bores is one best button, repeated" (4e's Twin Strike: "Every. Single. Ranger. Uses. Twin-Strike. Almost. Every. Round."; Pathfinder 2e's ranger "very boring and rotation dependent").
- **`tactical-combat.md`** (2026-11-13), takeaway 6: "a choice with one obvious answer is not a choice".
- **`paladins-other-games.md`** (2026-11-14), takeaway 11: "One Reaction a round is the protector's whole budget, and enemies learn it"; and its note for 2d12: AP kept from the turn already pay for more Reactions and an unused one becomes Guard 2: "That is already a 'hold something back to protect' decision in our rules".
- **`frontline-protection.md`** (2026-11-14): "My best turn is the GM's turn" as the protector's complaint; helping should not eat the helper's turn (4e's minor action, Draw Steel's triggered action).
- **`combat-length.md`** (2026-11-26): the turn budgets of 5e, 4e, Pathfinder 2e and Draw Steel in one table; "keeping AP for Guard and spending a Rally Point mid-fight become choices" in a longer fight: "This is the decision density Lucas missed."
- **`difficulty-levers.md`** (2026-11-26): a cost cannot show "whether choices mattered"; the AP spent by kind can. Guard's price "was an AP or a Reaction, paid as party damage not dealt".
- **`resources-and-recovery.md`** (2026-11-18): DC20 as "a pool refilled every round" beside 2d12's "4 and a Reaction AP".
- **`divinity-original-sin-2.md`** (2026-11-20): the talents that change the action economy are the loved ones; Adrenaline borrows 2 AP from the next turn.
- **`escalation-direction.md`** and **`escalation-and-guard.md`**: why the Escalation Passives left (forgotten, too small to track); protection must not be gated late.
- **`targeting.md`**, **`surprise-and-ambush.md`**, **`monster-building.md`**: how reactions are written; Nimble's first-turn actions; bosses are fixed by actions, not hit points.

**The rules as they stand** [from the rules]:
- **4 AP and 1 Reaction Point** at the start of your turn; unused AP are lost when you regain (Chapter 2, Action Points).
- **Unspent AP:** kept until your next turn; they can pay for Reactions; at the start of your next turn each one still unused gives **Guard 2** for a round (3 at Stage 2, 4 at Stage 3). So the Guard comes a turn late, and an AP kept on the last turn of a fight gives nothing. The Reaction Point never becomes Guard.
- **A Reaction** is paid with the Reaction Point, with kept AP, or both. No creature has a Reaction by default.
- **Frequencies:** At-will (each use after the first in a turn adds 1 Bane), Turn, Round, Encounter. **[Strike]:** at most 3 a turn; all At-will Strikes share one count (1 Bane on the second, 2 on the third). A Bane is −1 on 2d12 (Chapter 1).
- **Conditions:** Slowed, Quickened and Dazed change AP and "never" the Reaction Point; Staggered stops Reactions (the point waits); **Strained's whole effect is that you don't regain the Reaction Point** (Chapter 4).
- **NPCs:** a Standard or an Elite has 4 AP and the Reaction Point, a Grunt 3 and the point, **a Minion 3 and no Reaction Point: it pays a Reaction with an AP it kept. An NPC gains no Guard from unspent AP** (Chapter 14).
- **Cards that spend the Reaction Point as a resource:** Smite (1 more Smite die), Steady Draw (once an encounter, 2dE more on a Tier 2 or 3).
- **The classes' Reactions at level 1:** the Paladin has Shield of Faith and Rebuke (and Judge's free 0R re-Judge), with Bulwark of Faith at level 2; the Archer has Slip Away and Snap Shot. **Covering Fire is not a Reaction** (a 2 AP Encounter zone).
- **What left on 2026-11-25** (batch 5, v0.0.507): the six Arts (Round, 1 AP, three Modes each) and the Escalation Passives. Lucas: "Lets remove the Arts, lets reduce bloat for now. I might bring them back later but not yet". The record's reasons (`core-rework.md` H3 and Root 5): "Arts are hard to remember"; "Arts used 3 times in 20 PC turns"; level 1 "still front-loaded: Aveline has, technically, 9 abilities, 3 of them an Art's Modes". His idea for their return: each a single option, no Modes.
- **Open proposals** (`cards/review-2026-11-27/review.json`): Guard from an unspent AP 2 to 4; the Basic Attack's notes ("the At-will Banes [...] were paid and didn't stop it"; an option: 2 Banes for each use after the first).

---

## 2. Part A: 2d12's economy, measured

### 2.1 How the 108 AP of three fights were spent [from the playtests]

Counted from the logs of playtests 8, 9 and 10 (the same fight three times, before v0.0.527's new numbers): 28 PC turns, 112 AP, 108 spent. The 4 unspent were on the three turns that ended a fight.

| Spent on | AP | Share |
|---|---:|---:|
| The 2 AP Round cards (18 uses: Quick Shots 6, Strafe 5, Darting Blade 4, Binding Light 3) | 36 | 33% |
| Basic Attacks (28) and the Power Basic attacks (Drawing Light 2, Harrying Shot 4) | 34 | 31% |
| Maneuvers (Feint 10, Demoralize 7) | 17 | 16% |
| Smite (6 uses) | 12 | 11% |
| Movement paid with its own AP (8 Advances and one Charge's move) | 9 | 8% |
| Kept for Guard, Steel Yourself, Tend, Trip, Shove, Aid, Hide, Lay On Hands | 0 | 0% |

- **19 of the 25 full turns held at least one At-will Strike; 12 of them held two or three**, so they paid the At-will Banes. Of the 34 At-will Strikes, 14 were repeats (12 seconds, 2 thirds).
- **The last thing done on a full turn was an At-will Strike on 14 of 25 turns**, and one with At-will Banes on 9.
- **Movement cost 8% of the AP.** Most movement came free inside a card (Strafe's Advance, Quick Shots' and Darting Blade's Evade, the Charge).
- **Reactions:** the PCs regained 28 Reaction Points. They were offered a Reaction 10 or 11 times (the logs and the tables differ by one) and used it 9 or 10 times. **The one refusal was Shield of Faith passed on a 1 damage hit so that it was there for the next one.** About 18 Reaction Points expired unused. The logs don't show Smite's extra die; in playtest 8 neither Archer used Steady Draw's Special.
- **No AP was ever kept**, so no Reaction was ever paid with one and no Guard ever came from one.

### 2.2 What one AP buys [arithmetic]

A roll at +2 against DC 13: Tier 1 / 2 / 3 / Critical.

| Net | Tier 1 | Tier 2 | Tier 3 | Critical |
|---|---:|---:|---:|---:|
| 0 Banes | 27.8% | 45.5% | 22.3% | 4.5% |
| 1 Bane | 34.7% | 42.0% | 19.9% | 3.4% |
| 2 Banes | 41.7% | 39.4% | 15.9% | 3.0% |
| Doomed (3d12, keep the two lowest) | 56.7% | 36.7% | 6.6% | 0 |

The Basic Attack's expected damage at Weapon +2, and what the repeat keeps:

| Weapon | First | Second (1 Bane) | Third (2 Banes) | Doomed |
|---|---:|---:|---:|---:|
| Longsword | 11.2 | 10.3 (92%) | 9.4 (84%) | 7.0 (62%) |
| Arming Sword | 8.5 | 7.9 (93%) | 7.2 (85%) | |
| Hunting Bow | 6.5 | 6.1 (94%) | 5.7 (87%) | 4.6 (70%) |
| Recurve Bow | 6.8 | 6.3 (93%) | 5.9 (87%) | |

At the Paladins' real Weapon +1: Aveline (Longsword) 9.6 / 8.8 / 8.0, Durgan (Arming Sword) 7.2 / 6.7 / 6.2.

- **One Bane takes 6 to 8% of a Basic Attack.** Each more takes about the same again: 3 Banes keep 77% of a Longsword's attack, 5 keep 65%, 8 keep 52%. Even a Doomed repeat keeps 62 to 70%. The reasons are in the card: a Tier 1 still deals 1d4!, and a Tier 2 carries a flat number.
- **Pathfinder 2e's penalty, the same way** [mine: a d20, a hit deals 1 and a critical 2, the first attack hitting on a 10 or 11]: the second attack at −5 keeps 55 to 58% of the first, the third at −10 keeps 9 to 17% (an agile weapon: about 65% and 30%). **2d12's brake is about a sixth of that one's size.**
- **The Round cards deal less an AP than the Basic Attack.** Binding Light (Longsword) 12.8 for 2 AP is 6.4 an AP against 9.6 and 8.8 from two Basic Attacks. Quick Shots 9.7 for 2 AP is 4.8 an AP against 6.5 and 6.1. Strafe is 5.4 a target, Darting Blade about the same. The table measured it: Basic Attack 6.3 an AP, the Round cards 2.8, Smite 14.8 (playtest 8, section 2.5).
- **Boons are the same small coin, so the maneuvers are small too.** A Boon is +1: about +8% on the Strike it helps. Feint as changed in v0.0.527 (1 Boon on a Tier 2, 2 on a Tier 3) adds about 1.3 damage to a 25 damage Smite and under 1 to a Basic Attack. Demoralize's Vulnerable 1 is worth about 0.5 to 1 damage for each attack that follows it. A third Basic Attack is 6 to 9.
- **So for each AP of a typical turn:**

| AP | Best use | Second best | The gap |
|---|---|---|---|
| 1 and 2 | Smite when it is there (20 to 30 for 2 AP); otherwise two Basic Attacks (13 to 21) | The Round card (10 to 13) | The Round card is the worse buy; it is used "because it is there" (playtest 8) or for its rider |
| 3 | A Basic Attack with its Bane (6 to 10) | A maneuver (about 1 to 2), Guard 2 | 3 to 6 times |
| 4 | A third Strike when the cap allows it (6 to 9); otherwise a maneuver or a move | Guard 2 | 3 to 4 times when the Strike is there |

### 2.3 The Reaction Point [from the rules, from the playtests, judgment]

- **It is not a decision.** It is free, it expires, and nothing else wants it but two once-an-encounter cards. It was used nine times in ten when offered. "Use it or lose it" means the only question is whether a trigger comes, and that is the GM's doing.
- **It is a decision only when two triggers compete for one point** (the Paladin's Shield of Faith is a Turn Reaction: it can answer every enemy's turn if he can pay). That happened once in 28 turns.
- **The rules already hold the paid Reaction Lucas describes:** a kept AP pays for a second Reaction, and becomes Guard 2 if none comes. Nobody used it in three fights. That is a direct reading of how "keep an AP for a Reaction" fares at today's prices, and it was a second Reaction on top of a free one.
- **The Minion already lives under his rule** (no Reaction Point; an AP it kept pays). In three fights, six Goblin Sneaks never kept one, and Shriek and Scatter never happened. One sample (they die in a turn or two, and Lucas played them solo), but it points the same way.

### 2.4 What competes for an AP, and why none of it won [from the rules, judgment]

- **Movement:** the fights start close and the class cards carry their own movement, so position is rarely paid for. 8% of the AP.
- **Guard from a kept AP:** at most 2 damage prevented, a turn late, against 6 to 9 dealt now.
- **Feint, Demoralize:** used 17 times, mostly under the old Feint (Favored on a Tier 3) and before Smite. At the new numbers they are worth 1 to 2 damage.
- **Trip, Shove, Haul, Relocate:** never used by a PC. "No enemy was worth an AP to put Prone, because each was dead within a round of being reached" (playtest 8).
- **Steel Yourself:** 1 AP for a Rally Point is the largest thing one AP buys (11 to 13 Health now). Nobody was hurt enough: the three fights cost 1 Rally Point a PC and put nobody Down. **Enemy damage is now about 2.36 times higher (v0.0.527) and no fight has been played on it.** Healing, Guard and Shield of Faith have not yet been tested under pressure.
- **Aid** (the ally is Quickened 1): an AP moved, not made. Never used.

### 2.5 The verdict on his doubt

1. **"Rarely you get the feel of 'should I use this or that?'": confirmed.** [from the playtests] The turn is a Round card or Smite, then Basic Attacks; 31% of all AP went to At-will Strikes and none to anything defensive.
2. **"You already have so much you can do in a turn": not the cause.** [arithmetic] A turn holds two things: one 2 AP card and two more AP. The trouble is that the two more AP have an answer that needs no thought, because the repeated attack keeps 84 to 92% of its value and nothing else costs 1 AP and is worth half of it. Pathfinder 2e gives three actions and its players still complain about the third (section 3.2): the count is not what decides it.
3. **"Not limiting enough": true of the brake, not of the budget.** [arithmetic] The 3 Strikes cap and the Banes are the limits, and the Banes are worth 8% each.
4. **Two other causes sit beside it.** The Round cards are a worse buy than the At-will they compete with [arithmetic], and the three fights were easy and short, so nothing made defense or position worth an AP [from the playtests]. Playtest 8's own note: "Choices come from pressure and from time, and this fight had neither."
5. **The Reaction Point is the one part of the turn with no decision in it at all.** [judgment] His instinct to make it cost something is sound. What it should cost, and when the choice is made, is section 4.

---

## 3. Parts B and C: other games

### 3.1 The games

| Game | The turn's budget | What brakes repeating | How a reaction is paid | The known complaint |
|---|---|---|---|---|
| **Pathfinder 2e** | 3 actions, 1 reaction [checked: "3 actions and one reaction. Most everything is one action", Morrus on Bulmahn's post, 2018] | The multiple attack penalty: "–5" on the second attack, "–10" on the third and after (agile: –4 / –8), "only during your turn" [checked, Archives of Nethys] | A separate free slot, once a round | The third action: a third Strike "rarely land[s]", and what is left feels like filler (3.2) |
| **Nimble 2** | 3 actions; "All 3 actions recharge at the end of your turn, so there's no need to save them up" [checked, nimble.nexus] | "Rushed Attacks": "cumulative disadvantage for each additional attack after the first", on a die where a 1 misses [checked] | **From the next turn:** "Reactions cost 1 action"; "each reaction no more than 1/round, and they will start their turn with fewer actions" [checked] | Little found. Rulebooks "poorly laid out and unclear on a lot of things" (one reader's comment) [checked] |
| **DC20** (beta) | "4 Action Points in Combat to spend on a variety of actions both on and off their turn" [checked, the publisher's page, beta 0.10.5] | Repeating the same action gains "stacking Disadvantage" [lead: a search summary of the Kickstarter page; a fan sheet words it per Check] | **Out of the 4:** "Reactions to spend Action Points outside your turn" [checked]. AP are regained at the end of your turn, so a 1 AP reaction leaves 3 for the next turn [lead: summaries of beta 0.6 and 0.8] | Thin. One GM: the group "really enjoyed [...] the action point-based combat"; his trouble was "managing the extensive information" [checked]. A forum worry that a new player finds the fourth AP tedious [lead] |
| **Lancer** | A move, and two quick actions or one full action; Overcharge buys one more quick action for rising Heat [lead; `paladins-other-games.md` read the rules] | "the rule preventing you from taking the same action more than once per turn" [checked, the community FAQ] | Free: "one reaction per turn, once on each character's turn"; Overwatch once a round; **Brace costs the next turn** (one quick action only) [checked / lead] | Long turns [memory; not searched] |
| **Draw Steel** | A main action, a maneuver, a move [checked, EN World, 2026] | Typed slots: one main action | "one triggered action per round"; a free triggered action "doesn't count against your limit" [checked, Steel Compendium] | Many triggered actions to remember (`escalation-and-guard.md`) |
| **D&D 5e** | Action, bonus action, move, reaction | One Attack action | A free slot; **Ready** spends the action now for a trigger later | Ready is a trap (3.3); the bonus action: players "wracking their brain for bonus actions to try and optimize their turn" (Mearls, as reported) [lead] |
| **D&D 4e** | Standard, move, minor; an immediate action a round; opportunity actions | One standard action | Free slots | At-will spam (Twin Strike, `archer.md`); slow rounds (`combat-length.md`) [memory for the slots] |
| **13th Age** | Standard, move, quick | One standard action | Free | The paladin's own turn after the smite: "a little grinding" (`paladins-other-games.md`) |
| **XCOM (2012)** | "two actions per turn and attacking always ends a character's turn" [checked, Bycer, 2019] | Firing ends the turn | **Overwatch:** hold the shot for an enemy that moves | The first XCOM's time units were "too cumbersome to bring back" [checked]; "gradual Overwatch creep" as the dull best play (Solomon) [lead] |
| **Divinity: Original Sin 2** | 4 AP a turn, 6 at most; a weapon attack "will always cost 2" [checked, dos2.wiki] | Cooldowns; an attack is half the turn | No attacks of opportunity without a talent (`divinity-original-sin-2.md`) | A leftover AP is not lost: "carried over to the next turn" [checked] |
| **Gloomhaven** | Two cards: the top of one, the bottom of the other | A played card leaves the hand; the hand is the clock | No reaction slot | Analysis paralysis over the hand [memory; not searched] |
| **Daggerheart** | No turn budget; the spotlight moves | None | Reaction rolls are free | Not searched [memory] |
| **Savage Worlds, Shadowrun** | Extra actions by a penalty on every action of the turn | The penalty is the price | Free | Not searched [memory] |

Not found in a form worth a row: ICON, Fabula Ultima, Trespasser, Strike!, Baldur's Gate 3, Pillars of Eternity, Draw Steel's earlier drafts.

### 3.2 An untyped pool needs a brake, and a brake needs something to buy instead

- **Every untyped pool read has a brake far larger than 2d12's.** Pathfinder 2e's third attack keeps a tenth to a fifth. Nimble's is cumulative disadvantage on a die that misses on a 1. Lancer and Gloomhaven forbid the repeat. XCOM ends the turn on a shot. Divinity charges half the turn for an attack. [checked for the rules; the comparison is mine]
- **Nimble's designer names the trade the brake creates** [lead: a search summary of copies of the 5e-supplement text]: "Grappling, shoving, moving, and reactions all are far more interesting choices now. You could attack 3 times at level 1, but there are diminishing returns and only if you forego reactions and movement."
- **Pathfinder 2e shows the other half: a brake alone moves the problem.** Players call it the third action. [checked, Braithwaite, "Take Your Third Action", 2023] "third actions only suck if you use them at the end of your turn"; additional attacks "take a big to-hit penalty, and so rarely land"; the usual list is "Raise a Shield, Recall Knowledge, Demoralize, Create a Diversion, Bon Mot, Guidance"; his advice is to plan all three first, because the small action is better as a setup than as a leftover. [checked, Know Direction, 2020] a mnemonic (Gear, Aid, Skills, Prepare) so that players "remember more options in combat than that third attack at -10". [checked, Foundry's package page] a module exists to suggest third actions: "Third Strikes are never suggested."
- **So the brake makes room, and single-action options with their own effect fill it.** Where a class has none, its player still swings at −10 or feels the action is wasted. This is the place the Arts would stand.
- **Typed slots solve it by fiat and pay with rigidity.** One main action cannot be repeated, so the question never comes up; what remains is which slot is empty. Mearls on 5e's bonus action, as reported: "fairly hacky"; players come to "an expectation that you have a bonus action" [lead]. An EN World poster: sequential slots prompt "players to think of their turn as a set of boxes to fill" [checked, Li Shenron, 2026].

### 3.3 Paying for a reaction: three models

| Model | Games | When the choice is made | What happens with no trigger |
|---|---|---|---|
| **A free slot** | Pathfinder 2e, 5e, 4e, 13th Age, Draw Steel, Lancer, 2d12 today | At the trigger; it costs nothing | The slot expires |
| **A debt on the next turn** | Nimble; DC20 as far as it could be checked; Lancer's Brace; Divinity's Adrenaline | At the trigger, with the attack in front of you | Nothing was spent |
| **A hold from this turn** | 5e's Ready, XCOM's Overwatch, 2d12's kept AP and its Minions; **Lucas's proposal** | Before the trigger, on a guess | The held action is lost unless a fallback pays (2d12's Guard; Divinity's carried AP) |

- **The two nearest neighbours are debts, not holds.** Nimble says so in as many words: the actions come back at the end of your turn, "so there's no need to save them up", and a reaction means you "start [your] turn with fewer actions" [checked]. DC20 is described the same way (regained at the end of the turn; a reaction leaves 3 for the next) [lead]. Neither asks a player to keep something back and hope.
- **Nimble fences the debt:** each reaction once a round [checked]. A copy of its earlier text warns that too many reactions leave you "with 0 Actions and skipping your turn" [lead].
- **The hold without a fallback is the least used option in the games read.** 5e's Ready, in its players' words [checked, EN World, 2021]: "two thirds of the options aren't really options"; "but why would you wait before you act?"; it is for "the pressure and precision of timing things in combat". [lead] "an intentionally designed 'trap' option"; you "forego your action on your own turn to create a new trigger for a reaction that *may not* come up".
- **The hold that costs nothing becomes the default instead.** XCOM's overwatch was free when nothing else was worth doing, and its designer had to design against "gradual Overwatch creep" [lead]; XCOM 2's mission timers are the answer the article names [checked, Bycer].
- **So a hold lives between two failures:** priced too high it is a trap, priced at nothing it is the rote. What tunes it is the fallback and how readable the trigger is. 2d12 has both parts: Guard from the kept AP, and an open turn order that shows who acts next. Their sizes are the question (section 4).
- **No designer or analyst was found stating that players undervalue an uncertain trigger.** The Ready threads and the kept AP nobody used in three fights say it by behaviour.

### 3.4 What makes a choice in a turn

Sid Meier, GDC 2012, as reported [checked, Alexander, Game Developer]: "Games are a series of interesting decisions." It is easier to say what is not one: a choice where the player always picks the same option; a random pick. The marks of a good one: "One common characteristic of interesting decisions is that they involve some kind of tradeoff"; "Good decisions are situational"; risk against reward; short against long term. And pacing: very simple decisions at slow moments bore, complex ones back to back overwhelm.

Read against 2d12 [judgment]:
- **The third AP fails the first test** (always the same option).
- **A held Reaction passes three of them** (a tradeoff, situational, risk against reward) if neither side of the trade is always right. That is an argument for Lucas's idea, on the condition of section 4.1.
- **Decision density has a price in time.** Pathfinder 2e and Lancer are the games whose turns are called slow (`combat-length.md`). A fourth AP that is always a Basic Attack costs no thought; a fourth AP that is a real question costs table time on 28 turns a fight.

---

## 4. Part D: "4 AP, no Reaction Point" in 2d12

All of this is Claude's analysis on today's cards. The values are expected damage; a point prevented is counted as a point dealt, which flatters holding a little less than it deserves (a point dealt shortens the fight and so prevents about 0.7 of a point).

### 4.1 The end of the turn: attack, hold, or Guard [arithmetic, judgment]

A kept AP is worth: the chance of a trigger × the Reaction's worth, plus, when no trigger comes, Guard 2 if you are hit in the following round.

| | The AP as an attack | The Reaction it could pay | Hold is worth | Holding wins when |
|---|---:|---|---:|---|
| **Aveline** (Longsword +1) | 8.8 second, 8.0 third | Shield of Faith: 3 prevented and Taunted, about 4. Rebuke: Hindered and a likely disrupted move, about one enemy attack (7) when it lands | about 2.6 at the logs' trigger rate (about 0.45 a Paladin round) | even with the trigger certain, Shield of Faith would have to prevent about 8, or the attack fall to about 4 |
| **Durgan** (Arming Sword +1) | 6.7, 6.2 | the same | about 2.6 | the same, at about 6 prevented, or the attack at about 3 |
| **Sylwen, Kaela** (bows +2) | 6.1 to 6.3, 5.7 to 5.9 | Snap Shot: 5.2 damage, Hindered on a Tier 2 and Immobilized on a Tier 3 before the enemy arrives: about 9 to 11. Slip Away: about 5 to 9 | about 2.5 at the logs' rate (0.2 an Archer round) | **the chance that an enemy reaches her before her next turn is about a half or more** |
| Level 2 | | Bulwark of Faith: Guard 11 to 13 and a Slide, once an encounter | | a big hit on an ally is more likely than not |

- **Guard alone never wins.** At 2 it is worth about 1.4 for a front-liner and 0.6 for an Archer. At the proposed 4: about 2.8 and 1.2. The attack is 6 to 9.
- **The Paladin does not hold.** His triggers are common and his Reactions are small: 4 against 6 to 9, even when the trigger is certain. By the arithmetic he attacks with all four AP and Shield of Faith leaves the table, unless it is repriced to about twice its size.
- **The Archer gets the choice Lucas wants, as the cards are.** Her Reactions are large and their trigger is rare and readable: is that orc coming for me? Above about even odds she holds; below, she shoots.
- **The fallback comes too late to help.** The Guard starts at the next turn, so the round in which the AP was held is covered only by the Reaction. An AP held on the last turn is lost.
- **Before your first turn you have nothing to react with,** as today.

### 4.2 The classes and the cards that spend the point [from the rules, arithmetic]

- **The Paladin loses more.** He has two Reactions at level 1 and a third at level 2, all protective, all with common triggers; they are how the class protects. The "class margin" measured three times (a fifth of the enemies' damage) is mostly Shield of Faith. The Archer has two, rare, and they are her escape.
- **Smite's extra die** (free today) would cost 1 AP for 4 damage (5 against a Profane creature): worse than a Basic Attack. It dies unless it grows to about 2 dice.
- **Steady Draw's Special** works as it is: it is chosen after the roll, so nothing is risked, and 2dE is 5 at Escalation 1 and 2, 7 at 3, 9 at 4, against an attack of about 6. It becomes a real question from Escalation 3.
- **Judge's 0R** is free and stays so.

### 4.3 Party damage and the fight's length [arithmetic]

The AP a PC would hold is a repeated Basic Attack: about 6.7 on average across the four pregens. The party deals 16.1 a turn (playtest 10's average).

| A PC holds 1 AP on | Party damage a turn | A 3.5 round fight becomes |
|---|---:|---:|
| no turn | 16.1 | 3.5 |
| a quarter of the turns | 14.4 | 3.9 |
| half | 12.7 | 4.4 |
| every turn | 9.4 | 6.0 |

One AP in four is 42% of the party's damage, because the marginal Basic Attack is worth 1.7 times the average AP. A change that makes players hold is also a large cut to PC damage, on top of the enemies' new Health.

### 4.4 The enemies [from the rules, arithmetic]

- **The same rule would end most NPC Reactions.** An NPC gains no Guard from a kept AP, so its hold has no fallback: the trap of section 3.3. The Minions show it already.
- **Blood for Blood** is a Basic attack with 1 Bane later, on a condition, in place of the same attack now: never worth holding. **Backhand** (2 damage and a Push 2) against an attack of 7 to 9: never. **Dying Flare** would need the wisp to keep one of its 3 AP on the turn before it dies.
- **It is also one more decision for the GM on every creature's turn.**
- **The plain way out** [judgment]: the NPCs keep the Reaction Point, as a thing ranks have and PCs don't. The Minion is already the exception in the other direction.

### 4.5 The rules that name the Reaction Point [from the rules]

- **Strained** has no effect left; it needs a new one. This is the largest dependency.
- **Slowed and Dazed** would now cut the Reaction too (their text says they never do), so both get stronger. **Quickened** would add one.
- **Staggered** still works (no Reactions; the kept AP still becomes Guard).
- **Swapping Initiative** ("your Reaction Point still can"), the Glossary, the ranks' table, Smite, Steady Draw, and the Talent idea "a Reaction AP from the first moment" all need their sentence rewritten.

### 4.6 "Bring back the Arts" [from the rules, judgment]

- **The Arts did not leave for lack of AP.** They left for bloat and memory (section 1), and when they were there they were used 3 times in 20 turns.
- **A tighter budget makes a 1 AP utility harder to choose, not easier,** as long as a Basic Attack worth 6 to 9 sits beside it. With 4 AP and no Reaction Point, the Art would compete with the attack, the hold and the Guard for the same last AP.
- **What gives the Arts their place is the brake** (section 3.2). If the third or fourth AP is not worth an attack, a single-option Art is exactly the thing Pathfinder 2e's players go looking for. Lucas's sentence "now its just filler" describes the slot correctly; the Arts fill it only once the attack does not.

### 4.7 The alternatives

| Change | What it does | What it costs |
|---|---|---|
| **A. 4 AP, no Reaction Point** (a hold) | A choice at the end of the turn, for the Archer at once | The Paladin's Reactions and Smite's die die unless repriced upward; Strained needs a new effect; NPCs need an exception; up to 42% of PC damage if players do hold; a guess before the trigger (the weakest model in 3.3) |
| **B. 4 AP; a Reaction costs 1 AP of your next turn** (a debt, as in Nimble) | The choice is made at the trigger, with the blow in front of you; nothing is ever wasted; the Guard rule is untouched | Tracking a debt across turns; a turn of 3 or 2 AP after a hard round; still needs a Reaction worth a marginal AP; a cap is needed (Reactions' Frequencies already are one) |
| **C. A real brake on the repeated At-will Strike** | The third and fourth AP stop having a default; maneuvers, Guard, a held Reaction and the Arts all become live at their present sizes | PC damage falls (about 3 a turn if half the turns lose an attack); Banes alone can't do it (8 keep 52%), so it is a structural rule: at most 2 Strikes a turn, or a repeat that is Doomed (62 to 70%), or a repeat that costs 2 AP |
| **D. Typed slots** (one main Action a turn) | The repeat is impossible | It is the design 2d12 left; turns become "boxes to fill"; the AP pool loses its point |
| **E. 3 AP and a free Reaction** | A smaller turn | It removes the last AP, not its default: the third AP is still a Basic Attack at 92%; and it is Pathfinder 2e's shape without Pathfinder 2e's −5 |
| **F. Main cards cost more AP** | Fewer AP left to fill | Lucas calls it a bandaid, and the research agrees: the Round cards are already the worse buy per AP; a higher price widens the gap, and every game above brakes the repeat instead of pricing the main action up |
| **G. Reactions and the kept AP repriced, nothing else** (Guard 4, Shield of Faith larger) | Makes today's second Reaction and Guard worth an AP | Does nothing for the turn's attack-attack shape by itself |

### 4.8 A suggestion (Claude's, not a decision)

1. **The brake first (C), because everything else depends on it.** Each of A, B and G works only if the marginal AP is worth about what a Reaction or a Guard is worth, and today it is worth two to three times more. The cheapest brake to try is one word in Chapter 7: **at most 2 Strikes a turn**. A turn is then one 2 AP Strike, one Basic Attack and one AP that cannot be an attack, or two Basic Attacks and two such AP.
2. **Then the Reaction's price, as a second and separate test.** If the reaction is to cost something, the debt (B) fits the evidence better than the hold (A): it is what both neighbours do, it asks for no guess, and it leaves Strained, the Guard rule and the NPCs nearly alone (Strained could cost the debt double, for example). The hold is the form with the trap record. Lucas's own wording, "you choose if you keep a reaction or not", is the hold; it is worth knowing that neither DC20 nor Nimble asks that.
3. **Do not judge the economy on the three logs alone.** They are easy fights on the old numbers. The fight on v0.0.527's numbers is already next in the plan, and it is the first with pressure.
4. **The Arts come back after the brake,** one option each, as he sketched.

### 4.9 A cheap table test

The same fight, solo, on v0.0.527's numbers, three times:
1. **The baseline:** today's rules (already planned).
2. **Lucas's rule:** PCs gain 4 AP and no Reaction Point; a Reaction is paid only with a kept AP; Guard 2 as written; Smite's die and Steady Draw's Special cost a kept AP; the NPCs keep their Reaction Point; ignore Strained's effect.
3. **The brake:** today's rules with at most 2 Strikes a turn.

Record, for every PC turn (the Encounter Log already has "AP kept" and "Rx Used/Off"):
- The AP by kind: movement, At-will Strikes, a Round card, Smite, a maneuver, healing, kept.
- **What the last AP of the turn did**, and whether Lucas hesitated over it (a tick).
- For each kept AP: did it pay a Reaction, become Guard, or expire; how much damage the Guard took.
- **Reactions offered, used, and refused for lack of an AP** (the new number).
- The party's damage a turn, the round the last enemy fell, the cost in Rally Points a PC, the damage class cards prevented.
- The minutes a round.

How to read it:
- **Kept AP on under a tenth of the turns in test 2:** the attack still dominates and the Reactions died, as the arithmetic predicts for the Paladin.
- **Between a fifth and three fifths, and different from PC to PC:** it is a decision.
- **Over four fifths:** holding is the new rote.
- **In test 3, what the non-Strike AP went to:** if it is always the same thing (Feint, say), the default has only moved.

---

## 5. Not checked / unverified

- **DC20's rules text.** Only the publisher's product page was read. That AP return at the end of the turn, that a reaction costs 1 AP, what the Multiple Check Penalty says exactly, and held actions are leads (search summaries of beta 0.6 and 0.8 copies and of the Kickstarter page; two fan sheets that disagree: one lists a martial attack at 2 AP and reactions as free). **Read the current beta before leaning on DC20.** Its community's view on hoarding AP or on thin and rich turns: almost nothing found (one GM's blog; one forum lead).
- **Nimble's reception** of paid reactions: nothing found beyond the rules and one reader's comment. The designer's sentence on diminishing returns is a lead.
- **Pathfinder 2e's designers on why three actions**, and Paizo's own "third action" discussions: Paizo's site refused the reader. Only Bulmahn's lines as quoted by EN World. No designer statement on the third action was found.
- **Jake Solomon's own words** on time units and overwatch: Bycer's article reports them; the "Overwatch creep" quote is a lead. No GDC talk was opened.
- **Mike Mearls on bonus actions:** leads (forum reposts); the video an EN World thread of September 2026 refers to was not found.
- **Lancer:** the community FAQ and cheat sheets, which disagree on how reactions are counted; the core book was not opened. **Gloomhaven, Daggerheart, 13th Age, 4e's slots, Savage Worlds, Shadowrun:** memory. **ICON, Fabula Ultima, Trespasser, Strike!, Baldur's Gate 3, Pillars of Eternity, Draw Steel's earlier drafts:** not searched.
- **Refused or unreachable:** paizo.com, forums.giantitp.com, gameskinny.com, kickstarter.com, scribd.com, rpg.net, wiki.dc20.community, trade.zatu.com.
- **Part A's and D's own limits:** exact dice math, no map; the trigger rates (0.45 and 0.2 a round) are counts from three easy fights of one line-up; the worth of Rebuke, Slip Away, Taunted and Hindered is judgment; Prone's and Trip's worth was not priced; "a point prevented is a point dealt" is a simplification. The Pathfinder 2e comparison assumes a hit on a 10 or 11 and ignores damage riders.

---

## 6. Sources

- Nimble 2, rules reference: [Heroic Actions](https://nimble.nexus/rules/heroic-actions), [Heroic Reactions](https://nimble.nexus/rules/heroic-reactions), [Attack](https://nimble.nexus/rules/attack), [Defend](https://nimble.nexus/rules/defend), [Interpose](https://nimble.nexus/rules/interpose), [Initiative](https://nimble.nexus/rules/initiative), [Turns, rounds, encounters](https://nimble.nexus/rules/turns-rounds-encounters) [checked]
- Nimble, the designer's note and the earlier text [lead]: [a copy of Nimble 1.91](https://www.scribd.com/document/704333468/Nimble-1-91FINAL-Color); Thaumavore, ["Nimble 5e versus very large dragons"](https://thaumavore.substack.com/p/nimble-5e-versus-very-large-dragons), 2024 [checked]; Frank Mitchell, [notes on Nimble's rules](https://frank-mitchell.com/rpg/dnd5e/nimble-rules/) [checked]; EN World, ["What I Like About Nimble 2e"](https://www.enworld.org/goto/post?id=9838371), 2026 [checked]
- DC20: [the publisher's product page, Core Rules beta 0.10.5](https://thedungeoncoach.com/products/dc20-core-rules) [checked]; [the Kickstarter page](https://www.kickstarter.com/projects/thedungeoncoach/dc20) [lead, refused]; [a copy of beta 0.8](https://www.scribd.com/document/751008981/DC20-Core-Rules-Beta-0-8-PDF) [lead, refused]; fan references that disagree: [Combat Reference](https://elorea-wiki.pages.dev/07---Mechanics/DC20-Combat-Reference) [checked], [Quick Reference](https://elorea-wiki.pages.dev/00---Dashboard/Quick-Reference) [lead]; GameSkinny, ["Every major rules change from D&D 5e to DC20"](https://www.gameskinny.com/tips/every-major-rules-change-from-dnd-5e-to-dc20/) [lead, refused]; Kirk Gartside, ["Sitting in the GM chair"](https://goofydad.substack.com/p/sitting-in-the-gm-chair), 2025 [checked]; Giant in the Playground, [a DC20 thread](https://forums.giantitp.com/showthread.php?668290-Dc20=&p=26029714) [lead, refused]
- Pathfinder 2e: [Multiple Attack Penalty, Archives of Nethys](https://2e.aonprd.com/Rules.aspx?ID=2289&Redirected=1) [checked]; EN World, ["From 7 Action Types To Pathfinder 2's New 3 Action Economy"](https://www.enworld.org/threads/from-7-action-types-to-pathfinder-2s-new-3-action-economy.665200/), 2018 [checked]; Andrew Braithwaite, ["Take Your Third Action"](https://ambush.substack.com/p/take-your-third-action), 2023 [checked]; Dustin Knight, ["Fox's Cunning: The Second GASP"](https://knowdirectionpodcast.com/2020/05/foxs-cunning-the-second-gasp/), 2020 [checked]; [PF2e Third Action Suggester, Foundry package](https://foundryvtt.com/packages/pf2e-third-action-suggester) [checked]; Paizo, ["All About Actions"](https://paizo.com/community/blog/v5748dyo5lklh) and [a thread on the multiple attack penalty](https://paizo.com/threads/rzs2vb9m) [refused]
- XCOM: Josh Bycer, ["A Deep Dive Into XCOM and XCOM 2"](https://www.gamedeveloper.com/design/a-deep-dive-into-xcom-and-xcom-2), 2019 [checked]
- Divinity: Original Sin 2: [Action Points, dos2.wiki](https://dos2.wiki/wiki/Action_Points) [checked]
- Lancer: [the community FAQ](https://lancer-faq.netlify.app) [checked]; [a rules summary](https://lancer-rules.carrd.co/) [lead]
- Draw Steel: [triggered actions, Steel Compendium](https://steelcompendium.io/v2/Browse/rule/combat/triggered-action/) [checked]; EN World, ["Action Points and games that use them"](https://www.enworld.org/posts/9912918/), 2026 [checked]
- D&D 5e: EN World, ["Take the Ready action"](https://www.enworld.org/threads/take-the-ready-action.681614/), 2021 [checked]; Giant in the Playground, ["Ready Actions should be strictly better than normal Actions"](https://forums.giantitp.com/archive/index.php/t-634838.html) [lead]; EN World, ["Mike Mearls on 5e design he regrets: bonus actions"](https://www.enworld.org/threads/mike-mearls-on-5e-design-he-regrets-bonus-actuons.720616/), 2026 [checked for the replies, lead for Mearls]
- Sid Meier: Leigh Alexander, ["GDC 2012: Sid Meier on how to see games as sets of interesting decisions"](https://gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions), 2012 [checked]
- 2d12's own files: `rules-src/01-roll.md`, `02-turns.md`, `04-health.md`, `07-traits.md`, `08-conditions.md`, `14-bestiary.md`; `cards/basic-actions.json`, `cards/stage0/paladin.json`, `archer.json`, `bestiary.json`; `core-rework.md`, `rules-backlog.md`, `bestiary-design.md`; `playtest-8.md`, `playtest-9.md`, `playtest-10.md`; `cards/review-2026-11-27/review.json`; `ruler/benchmark.mjs`
