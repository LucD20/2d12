# Paladin: card analyses (the Card Workbench's drafts)

One analysis per card Lucas drafts in the Card Workbench (https://claude.ai/artifact/3WPdWkXLfe4dtAV81QAwN6). The format (Lucas, 2026-11-14): the card, its lines priced as the Workbench shows them, each number tagged with where it comes from, a total, then an analysis of the card as a whole. **The SIM gives rough anchors, not the answer:** table feel and position are judged here, with the research notes (`book/research/`).

**Tags:** [SIM] measured by the SIM · [Lucas] Lucas's rate (`book/cards/manual/budget.js` RATES) · [judgment] Claude's estimate, with what it is anchored to · [not priced] no agreed number (a suggested range follows).
**Anchors:** a Weapon Attack 25 · 1 Health 12 [SIM] · 1 Guard 6 [SIM, guide] · an unused AP 12 [SIM] · a Round AP 25, an Encounter Action double its AP · a 1R Reaction adds 10 to 15 a turn · a Passive about +10 a level (a guess).
**Builds:** the Lay On Hands Paladin (Weapon +1, Power +2) and the Smite Paladin (Weapon +2, Power +1), Stage 0.

---

## 2026-11-14: Lucas's first four drafts

### Lay On Hands (Hallmark Action, Round)

> **1 AP:** The target can use 1 Rally Point, gaining 3 Guard, and they can Evade 1.
> **2 AP:** The target can use 2 Rally Points, gaining 6 Guard, and they can Evade 2.
> **3 AP:** The target can use 2 Rally Points, gaining 6 Guard, and they can Evade 4.

```
1 AP                                     2 AP                                     3 AP
1 Rally Point ......... 5   [Lucas]      2 Rally Points ....... 10   [Lucas]      2 Rally Points ....... 10   [Lucas]
Guard 3 .............. 18   [SIM]        Guard 6 .............. 36   [SIM]        Guard 6 .............. 36   [SIM]
Evade 1 (an ally) .... 10   [judgment]   Evade 2 (an ally) .... 15   [judgment]   Evade 4 (an ally) .... 18   [judgment]
─── Total: 33 of 25 (over by 8)          ─── Total: 61 of 50 (over by 11)         ─── Total: 64 of 75 (under by 11)
```
*The Workbench shows 26 / 55 / 60: it prices the Evade at your melee rate (3 / 9 / 14). The ally's Evade is judged between your melee rate and the SIM's ranged 30 / 30 / 34, because the Paladin chooses who gets it.*

**Analysis.**
- **The granted Evade is the best part of the card, and it gets better with your Advance rule.** It costs the ally nothing and fires no Reaction. On the Archer it is the step out of Engaged before its shot (no Doomed roll: the SIM's 30). On a melee ally it is the step into Flanking (up to 2 Field Boons) or out of a Zone. With an Advance that can't be split, the ally can no longer attack and then step on its own: your Evade gives it that. This is the 4e Warlord's "quarterback" move (research: movement-positioning.md, takeaway 2).
- **Guard instead of new Health suits a Hallmark you use every round.** Guard doesn't stack and ends with the fight, so it can't snowball, and it lands before the next hit (research: escalation-and-guard.md: temporary hit points about two thirds of healing; 6 a point is fair, 8 when the ally is about to be hit).
- **The Versions don't scale:** 2 AP is the sweet spot, and 3 AP adds only two squares of Evade for a whole AP. A player will never pick it.
- **"One willing creature" includes you.** Lay On Hands 1 AP on yourself (a Rally Point, Guard 3, Evade 1) beats Steel Yourself (2 AP, a Rally Point). Fine if meant; otherwise "another willing creature".
- **Table feel:** good. One touch, three visible things (Health back, a shield, a step). Quick to resolve; the step is a decision for the ally's player, which keeps them engaged on the Paladin's turn.

**Suggestion:** keep 1 AP (a little over is fine on a Hallmark), keep 2 AP, and give 3 AP something of its own: **2 Rally Points, Guard 9, Evade 3** (10 + 54 + ~16 = 80 of 75: within).

### Shield of Faith (Hallmark Reaction, 1R, Turn)

> **Interrupt:** A [Strike] Action would damage an ally within 5 squares.
> **Targets:** The triggering creature.
> The target must choose: the Action deals half damage; or the target is Taunted by you and you are Empowered, for 1 round.

```
Option A: half damage (a hit of about 7) .............. 42   [SIM 12 a Health; the hit's size: judgment, a Standard's average hit]
Option B: Taunted by you (1 round) ...................... 2   [SIM: Taunted measured 1 to 3]
          you Empowered (1 round: one 1d6!, about 4.2) .. 7   [judgment: anchored to a Weapon Attack, 11 damage = 25, × the chance to hit]
The attacker picks the cheaper one for itself: B (9), unless the hit would put the ally Down (then A)
Each time it fires ...................................... about 10   [judgment]
× it fires in about half to 60% of rounds (allies only, no longer "you or")
─── Total: 5 to 6 a turn, of 10 to 15 (under by about 6)
```
*The Workbench reads 0: it can't read "must choose" yet.*

**Analysis.**
- **The enemy's choice is the right shape** (research: tactical-combat.md, takeaway 4, Glimpse of Redemption): it is good whatever the enemy picks, it is a decision at the table every time, and it covers a mindless creature (the GM picks).
- **But B is too cheap, so the GM always picks it** and the card becomes "Taunt and a small bonus die". A choice is only interesting when both sides hurt.
- **Taunted is the defender's tool the Paladin lacked** (research: takeaway 3): it makes ignoring the Paladin cost something. One round is short.
- **Empowered only pays if you hit on your next turn**, and only once (the first damage). It rewards a Paladin who is already next to the attacker: good for the Smite build, weak for Lay On Hands.

**Suggestion:** make B hurt about as much as A: **"Taunted by you for 2 rounds, and you are Empowered against it"** (about 4 + 7 = 11 to 15), or B adds "and the ally can Evade 1" (the step out of reach, 10 to 30). Either lands it at 10 to 15 a turn.

### Reckoning (Escalation 6 Passive, the Smite build's pick)

> You emit Bright light in a 2 Emanation. The first time your turn begins when you have Escalation 6, enemies in the area are Pushed 2 and must make an Appeal Save: Frightened of you (2 rounds) / Frightened of you (EoT) / No effect.

```
Bright light, 2 Emanation ............................. not priced (matters only in Dim light or Darkness: suggested 0 to 5)
Pushed 2, about 2 enemies in a 2 Emanation ........... 12   [judgment: 6 each, below your Slid 2 (11): a Push can't curve]
Frightened by Save (a Standard: Tier 1 38%, Tier 2 45%) 5   [judgment: Frightened (EoT) measured 2 to 4 (SIM), 2 rounds about double]
─── Once a fight, when Escalation 6 comes: about 17, for the 1 to 3 turns left (about 6 to 9 a turn)
    A Passive: about +10 a level (a guess) → under, and only in the fights that reach Escalation 6
```
*The Workbench reads 0: it can't read Pushed or a Save line yet.*

**Analysis.**
- **This is exactly the kind of Escalation 6 card the research recommends:** one flashy, visible moment instead of an ongoing +1d10 nobody sees (research: escalation-and-guard.md: 13th Age ties its flashiest abilities to the escalation die).
- **The catch is still the rung.** Escalation 6 comes in round 6 without Momentum (most fights are over) and round 4 with Momentum 2. 13th Age gates big abilities at 3+ on its die, which is about our 4. At 6, this card shows up in the long and the hard fights only. That may be fine (it is the "turning point" card), but its value is small on average.
- **Push 2 and Frightened work together:** Frightened makes every square toward you Difficult Terrain, so the push sticks. It is a "breathing room" button for a surrounded Paladin.
- **The Push needs a payoff to be worth more** (research: tactical-combat.md, takeaway 1): the Paladin chooses the destinations, so aiming them into walls (Collision 2 a square) or away from the Archers is where its value is. Pushing enemies away from you can also push them toward your back line: a real risk.
- **Rules to settle:** the Save's DC (a Passive has no trait: "13" by default, or 11 + your Power Modifier with [Power] on it); the light lasts while your Escalation is 6 or more?

**Wording:** "Bright light" (lower case), the Save in the book's format ("Appeal Save: Frightened of you (2 rounds) / Frightened of you (EoT) / No effect."), and "Aura" isn't a trait (the Area line is "Aura 2" if it is an aura).

### Hallowed Stance (Escalation 6 Passive, the Lay On Hands build's pick)

> You add your Power Modifier to damage on your Divine Actions, and all your Divine Actions gain: "Setup: You Advance 3."

```
+ Power Modifier to damage on Divine Actions ......... about 1 a turn   [judgment: on this build only the Encounter Picks deal Divine damage; Smite build: about 2]
Setup: Advance 3 on each Divine Action (once a round, Lay On Hands) .. about 10 a turn   [not priced: Advance has never been measured; suggested 8 to 15]
─── About 11 a turn while Escalation is 6, of about +10 (a guess) → on, when it comes
```
*The Workbench reads 0: it can't read Advance or a damage bonus yet.*

**Analysis.**
- **The free Advance 3 is the whole card.** A move bundled into an Action is strong because it saves the move's AP (research: movement-positioning.md, takeaway 3: Pathfinder 2e's Sudden Charge, 4e's Nimble Strike). With your Advance rule it is also the only way to move, act and move again.
- **"All your Divine Actions" includes the Reactions:** Shield of Faith with "Setup: Advance 3" moves the Paladin on an enemy's turn, toward the ally being hit. That is a very strong bodyguard move. Decide if it's meant; if not, "your Divine Actions on your turn".
- **The damage half is clutter:** about 1 a turn on this build, and a second thing to remember. The research's advice (takeaway 5 of tactical-combat.md): Passives that change what you do read better than small bonuses. Dropping it loses almost nothing.
- **Same rung problem as Reckoning:** at Escalation 6 it is on for a few turns of the long fights only.
- **Table feel:** good. The Paladin crosses the field to reach whoever needs it, every round.

**Suggestion:** drop the damage; keep "Setup: Advance 3" (or "Evade 2", which fires no Reactions); decide on the Reactions. If you want more than the long fights to see it, this is the card that could sit at Escalation 4 instead.

### Numbers to settle (proposed, not in the Workbench yet)

| Thing | Proposed | Anchored to |
|---|---|---|
| Evade given to an ally (the Paladin picks who) | 1: 10 · 2: 15 · 3: 16 · 4: 18 | between your melee 3 / 9 / 14 and the SIM's ranged 30 / 30 / 34 |
| Pushed 1 / 2 / 3 (a PC's, aimed by the player) | 3 / 6 / 10 | below your Slid 5 / 11 / 18 (a Push can't curve); the SIM's unaimed Push is about 0 |
| Frightened (EoT) / (2 rounds), on a hit | 3 / 5 | the SIM: Frightened (EoT) 2 to 4 |
| Taunted by you (1 round) / (2 rounds) | 2 / 4 | the SIM: 1 to 3 |
| You are Empowered (1 round) | 7 | one 1d6! (4.2) on a Weapon Attack's scale (11 = 25), × the chance to hit |
| Advance X as a Setup or a rider | 3: 10 (8 to 15) | an AP spent to move is worth at least an unused AP (12); a bundled move only on the turns you'd have moved |
| Bright light (on a creature or around you) | 0 to 5 | matters only where it is dim or dark |
| Guard given to an ally about to be hit | 6 to 8 a point | the SIM's 6, the forums' two thirds of healing (8) |

---

## 2026-11-14: are our Actions doing too much? (Lucas's question)

**Research:** `book/research/ability-scope.md` (new). **Counted:** every Paladin and Archer card, its words and the distinct things it does (conditions, movements, heals, Guard, light, Boons and Banes, conditionals).

**What the count says.**
- **Most cards are not long.** The Archer's are lean (15 to 50 words, one to three things); most Paladin cards are 20 to 45 words.
- **The few that do too much are where it hurts most:**

| Card | Used | Words | What it does |
|---|---|---:|---|
| **Smite** (Hallmark) | every round | **133** | three Versions × three Tiers of damage (9 damage cells), Bright light of two sizes, a Bane on Hide, Guard with Stage dice to you or an ally in the light, a Push of every other creature in the light |
| Final Verdict (Apex) | once | 67 | damage to an area, Push, light, Prone if Bloodied, Bleed if Strained (three conditionals) |
| Hallowed Dawn (Apex) | once | 64 | a heal with Stage dice, an effect ended, a Push, a Bane, light, on two sides |
| Lucas's Reckoning draft | once | 40 | light, a Push, a Save, Frightened in two durations |
| Lucas's Lay On Hands draft | every round | 3 × 3 things | a Rally Point, Guard and an Evade in each of three Versions |

- **The every-round card is the most complex one.** That is backward (research, takeaway 1: the cards met most should be the simplest; complexity goes to the rare ones).
- **The bigger problem isn't length, it's sameness.** Of the Paladin's Actions, every one is damage, healing or a defense number; of its seven Passives, four add damage. Nothing compresses a turn, bends a rule, or works outside a fight. The Archer is the same shape (almost every card is "a Weapon Attack + X").
- **The 1 / 2 / 3 AP Versions are the turn's real script.** A turn becomes "the biggest Smite I can afford, then attacks" (Advance, Smite, attack): a budget problem, not a board problem (research, takeaway 5). Three sizes of one card read as one option.

**Proposal (for Lucas to decide; nothing applied).**
1. **A complexity budget by Frequency.** A Round or At-will Action and a Reaction: **one main effect and at most one rider**, one Version or two. An Encounter Pick: up to two riders. The Apex: as much as it wants (it is the rare card).
2. **Five kinds of Action, and every class gets some of each:**
   - **Strike:** damage and at most one rider (Smite reduced to its core).
   - **Compression:** two Basic Actions for less, no new numbers ("Advance, then Shove", "Stand and Advance", "Advance and Lay On Hands as you pass").
   - **Help:** one thing for an ally (a heal, a step, Guard).
   - **Rule-bender:** changes a rule, not a number (your Bright light: creatures in it can't Hide; you carry a Down ally at full Speed; your Lay On Hands reaches 3 squares).
   - **Ribbon:** out of combat, flavor, small (sense the Profane nearby; your holy symbol is a light source; an oath).
3. **Fewer Versions, more cards.** Instead of Smite at 1 / 2 / 3 AP, two or three small Round options with different effects, so the board picks the turn.
4. **A 0 AP everyday trick** per class (as Mark Quarry is for the Archer), instead of a bigger Hallmark.

**Smite as an example of "one main effect, one rider"** (a sketch, not priced): *1 AP, Round: a Weapon Attack that deals an extra [R] 1d6 Ho on a hit, and the target sheds Bright light (1 round): it can't Hide.* The 2 and 3 AP sizes become other cards: a Compression ("Advance 3, then Smite") and a Help ("Smite, and an ally adjacent to the target gains Guard [Mod]").
