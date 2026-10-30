# Options (sidegrades) and Talents (pack OT, 2026-10-30): PROPOSED

Step 6 of the class charter (`book/class-charter.md`, section 7): **every other Pick as a sidegrade priced against the default; then the
Talents (Class Expertise included), checked for overlap.** Nothing here is in `book/rules-src` yet: you answer the decision sheet (section 8),
then the cards go into the book (12-paladin.md, 13-archer.md, 16-talents.md), then Foundry (pack C: the class items, the Talent picker's data).

The ruler files: `book/ruler/catalogue/paladin-options.txt`, `archer-options.txt`, `talents.txt` (melee, on the P1 Paladin's numbers) and
`talents-ranged.txt` (on the A1 Archer's); two builds that take options in the simulated days, `classes/paladin-smite-1-options.txt` and
`classes/archer-double-3-options.txt`. Numbers: `node book/ruler/econ.mjs` (prices.md section 4, the new tables "Paladin (options)",
"Archer (options)", "Talents") and `node book/ruler/spec.mjs` (report.md). Price = damage-equivalents (DE) at level 1; efficiency = DE per
AP ÷ 4.66; bands: Round 1.0-1.3, Encounter 1.4-2.0, Daily 2.0-3.0; a 0 AP Action 8-25% of a turn. Escalation Actives are compared **per turn**
(the DE of a use × the uses a fight ÷ the rounds of a fight), because Escalation, not AP, is what limits them.

**Found on the way, fixed:** the ruler had stopped running since pack C1 (it read the old Bestiary tables `npcMeasured` and a single CV
number from Foundry's config). `econ.mjs` and `spec.mjs` now read E3's tables by Stage and CV ×100. So prices.md and report.md now use **the
E3 Bestiary** (a Standard deals 10.7 a turn against AD 13, was 7.9; Health 63, was 57): the price of +1 Defense and of a Bane went up
(0.87 → 1.18 DE), Consecrated Ground 3 is now **over** (3.51), Aura of Protection 32% of a turn. The P1 and A1 budget rows moved by 0 to 4 points (section 7).

## 1. How the options are written (the rules of this step)

1. **A slot is a Pick kind** of the level list: **Encounter, Daily, Passive Escalation, Active Escalation** (the charter's template). Each
   slot lists its default and 2 to 4 options. The level 1 and level 3 Passive Escalation Picks draw from the same list.
2. **A sidegrade is the same power with a different job.** An option sits on its slot's band and within about 10% of the default's
   efficiency (an Action) or of its DE a turn (an Escalation Active or Passive). Each option changes the job: damage, area, protection,
   rescue, control, mobility.
3. **The role holds.** An option may move value between the Paladin's own damage and the party's (Divine Surge is party damage), but not
   past the role budget: a Paladin option that raises its own sustained damage is off role (Judgment, section 4).
4. **Round and Turn cards have no slot** in levels 1 to 3 (the template has none). Each old Round or Turn card becomes an Escalation Active
   (Shield of Faith), a Talent if two classes could want it (Sacred Weapon, Champion's Challenge, Long Draw, Steady Nerves), is folded into
   another card (Call to Arms, Suppressing Fire), or leaves (section 4).
5. **Model A** (no sustained growth inside Stage 1): the level 3 Passive Escalation should not add own damage. Each Passive list has a
   non-damage option of the same weight (Mending Light, Harrying Shots); Radiant Zeal stays the default for the playtest (decided).

## 2. The Paladin's options

### Encounter Pick (level 1). Default: Holy Wrath (2 AP 18.3, 1.96 · 3 AP 27.8, 1.99)

#### Word of Radiance (Paladin Encounter) · 2 / 3 AP · the area Nova, a Power Action · reworked
**Flavor:** You speak a word, and light pours from your hands across everything that stands against you.

*Area • Divine • Power* · **Frequency:** Encounter · **Target:** All enemies in the Area · **Area:** 2 / 3 Emanation · **Distance:** 5 sq. · **Vs:** WD

| | 2 AP | 3 AP |
|---|---|---|
| **Tier 1** | [M] 1d10 Ho | [M] 2d6 Ho |
| **Tier 2** | [M] 2d8 Ho | [M] 2d10 Ho |
| **Tier 3** | [M] 3d6 Ho; Prone | [M] 3d8 Ho; Prone |

*Price:* 2 AP 17.5 (1.88) · 3 AP 27.2 (1.95): **on target**, the same as Holy Wrath (was 14.3 / 23.3). This is the "Power list" item of
paladin-old-cards.md: the Paladin's Nova as a [Power] Action (Mind or Appeal), spread over 2 to 2½ enemies. Its best turn on one creature is
93% of the baseline (the Nova budget is measured on one creature), and in the days it lands on fewer enemies than the price list assumes (the
fight gives an area of 2.5 two targets): the build with it deals 94% on all turns against Holy Wrath's 103% (section 7). It buys area and Prone, not damage.

#### Bulwark of Faith (Paladin Encounter) · 1 / 2R · in the book, unchanged
*Price:* 1R 8.1 (1.73, on target) · 2R 9.1 (0.97, under: Slid 2 is worth 1.0). Kept as Lucas wrote it (round 6): the 2R is the "push them off" choice.

### Daily Pick (level 3). Default: Consecrated Ground (2 AP 23.6, 2.53 · 3 AP 49.1, 3.51 **over** with the E3 Bestiary)

#### Miraculous Recovery (Paladin Daily) · 2 / 3 AP · the book's old card; Target written as Lay On Hands'
**Flavor:** You lay both hands on the wound and call in a debt owed to your god.

*Divine • Focus* · **Frequency:** Daily · **Target:** One [[Willing and Unwilling|willing]] creature · **Distance:** Reach

| 2 AP | 3 AP |
|---|---|
| The target heals twice what 1 Rally Point would heal, and you end one non-permanent effect of your choice on them. | As 2 AP, but three times what 1 Rally Point would heal. |

*Price:* 2 AP 22.3 (2.40) · 3 AP 31.1 (2.23): **on target**. New Health, not the target's Rally Points. "One willing creature" (was "you touch an ally"): an Unconscious ally counts as willing, as for Lay On Hands.

#### Divine Intervention (Paladin Daily) · 2R · reworked (one Version)
**Flavor:** You reach out, and your god answers before you finish the prayer.

*Divine* · **Frequency:** Daily · **Target:** One creature · **Distance:** 5 sq. · **Interrupt:** You or an ally within 5 squares would go Down.

| 2R |
|---|
| Instead of going Down, the creature's total damage becomes 1 less than their Health Pool. |

*Price:* 34.1 (3.66, over on paper: a Down prevented is 35 DE, and an ally goes Down on 98% of the days with the E3 Bestiary). It needs 2 AP
kept after your turn, and E2 priced a kept AP at 1.78 DE a turn: held for two turns, the card is about 2.9, on its band. Was 1R (6.83) and
2R with a Rally Point (4.36); the Boon on the next Save is gone (NPC Saves aren't modeled, and it was the least of the card).

### Passive Escalation Pick (levels 1 and 3). Defaults: Hallowed Stance (4.6 DE a turn weighted, 20%), Radiant Zeal (2.2, 10%)

#### Mending Light (Paladin Escalation, Passive) · NEW, the non-damage option
**Flavor:** Light gathers where you stand, and the hurt are drawn to it.

While your Escalation is 1 or more, at the start of each of your turns, you or one ally within 5 squares of you heals your Power Modifier + 1.

*Price (by hand: a passive heal isn't in the spec format):* 3 Health a turn × 1.1 = 3.3 DE when someone is hurt (nearly every turn of a
fight); weighted by Escalation 1 or more (77% of the rounds) **2.5 DE a turn, 11%**: Radiant Zeal's weight (2.2, 10%) without own damage. It
works only in a fight (Escalation is 0 between fights), so it can't be farmed. It doesn't stack with itself (two Paladins: one heal each).

### Active Escalation Pick (level 1). Default: Divine Surge (6.4 a use, 27% of a turn; **5.6 DE a turn**)

| Option | Escalation | Per use | DE a turn | Job |
|---|---:|---:|---:|---|
| **Divine Surge** (default) | 1 | 6.4 (27%) | 5.6 | the party's damage, Guard for you |
| **Aura of Protection** (in the book) | 1, Encounter | 7.4 (32%) | 6.5 | +1 Defense for everyone near you, all fight |
| **Shield of Faith** (moved from Turn) | 1 | 6.2 (27%) | 5.4 | stops one hit |
| **Hand of Mercy** (with Call to Arms) | 1 | cleanse 4.7 · rescue 25.0 | 4.2 · 5.9 | ends a condition, or a Down ally gets up |

#### Shield of Faith (Paladin Escalation) · 0R · moved from the Repertoire's Turn list, reworked
**Flavor:** A shimmer of light holds steady between them and harm.

*Divine • Focus* · **Escalation:** 1 · **Frequency:** Turn · **Target:** The creature the Strike would damage (you or an ally) · **Distance:** 5 sq.
· **Interrupt:** A [Strike] Action would damage you or an ally within 5 squares.

| 0R |
|---|
| The damage that Strike deals to the target is reduced by 1d8 + your Power Modifier. |

*Price:* 6.2 a use (27% of a turn, the same as Divine Surge) · 5.4 DE a turn. Was 1R with 1d6 (1.12): a Turn card had no slot, and an
Escalation Reaction needs no AP kept. Its Escalation is spent on the enemy's turn, so it competes with Hallowed Stance like Divine Surge does.

#### Hand of Mercy (Paladin Escalation) · 1 AP · reworked (Call to Arms folded in)
**Flavor:** A single touch undoes what the enemy worked for.

*Divine • Focus* · **Escalation:** 1 · **Frequency:** Round · **Target:** One ally · **Distance:** 5 sq.

| 1 AP |
|---|
| Choose one: the ally ends one effect on them that is EoT or has 1 round left; or, if the ally is Down, they can use 1 Rally Point. |

*Price:* the cleanse 4.7 a use (1.02, on target), 4.2 DE a turn; the rescue 25.0 a use (35 DE × the 46% of the fights in which an ally goes
Down; over on paper, but at most once or twice a fight), 5.9 DE a turn. Call to Arms (0 AP, 87% of a turn) was the rescue for free; here it
costs 1 AP and 1 Escalation. For a Lay On Hands Paladin the rescue is worth less (Lay On Hands already gets a Down ally up at Reach).

#### Aura of Protection · in the book, unchanged (32% of a turn with the E3 Bestiary: a little over the 0 AP guide, 6.5 DE a turn against Divine Surge's 5.6)

## 3. The Archer's options

### Encounter Pick (level 2). Default: Marksman's Shot (2 AP 16.0, 1.71)

#### Volley (Archer Encounter) · 2 AP · reworked (was 3 AP, under)
**Flavor:** You empty the quiver skyward, and the arrows fall together.

*Area • Ranged • Save • Shot • Weapon* · **Frequency:** Encounter · **Target:** All creatures in the Area · **Area:** 2 Emanation ·
**Distance:** Your weapon's normal range · **Vs:** Instinct Save

| | 2 AP |
|---|---|
| **Tier 1** | [B] 2d8 + [Mod] Pi; Hindered (EoT). |
| **Tier 2** | [B] 1d10 + [Mod] Pi |
| **Tier 3** | [B] 1d4 Pi |

*Price:* 16.1 (1.73): **on target**, the same as Marksman's Shot (was 3 AP 13.3, 0.95). The area option. It targets all creatures: aim it where your allies aren't.

#### Covering Fire (Archer Encounter) · 2 AP · reworked (Suppressing Fire folded in)
**Flavor:** Nobody walks through that ground without paying for it.

*Area • Ranged • Shot • Weapon* · **Frequency:** Encounter · **Target:** All creatures in the Area · **Area:** 2 Emanation · **Distance:** Your weapon's normal range

| 2 AP |
|---|
| For 3 rounds (the area doesn't move), enemies in the area take 1 Bane on [Strike] Actions, and allies in it gain +1 Defense. |

*Price:* 14.1 (1.52): **on target**, 12% under Marksman's Shot (was 2.6, 0.28; the 1d4 for entering, hazardous terrain, isn't modeled
and is gone). The support option: the Archer's version of a zone, an Encounter where the Paladin's Consecrated Ground is a Daily.

### Daily Pick (level 3). Default: Hunter's Focus (1 AP 13.0, 2.79)

#### Deadeye (Archer Daily) · 1 AP · reworked (was 3 AP, under)
**Flavor:** You put everything into one shot, and everything into the one after.

*Ranged • Shot • Strike • Weapon* · **Frequency:** Daily · **Target:** One creature · **Distance:** Weapon · **Vs:** AD

This Action is Favored.

| | 1 AP |
|---|---|
| **Tier 1** | [B] 1[W] |
| **Tier 2** | [B] 1[W] + [Mod] + 1d6 Pi |
| **Tier 3** | [B] 1[W] + [Mod] + 2d6 Pi; Prone. |

*Price:* 12.8 (2.74): **on target**, the same as Hunter's Focus. One shot now instead of the rest of the encounter. At 2 AP it put the Archer's best turn at 169% (the Nova budget is 110-130%), so it stays 1 AP like Hunter's Focus.

#### Rain of Arrows (Archer Daily) · 2 AP · reworked (was 3 AP; the lasting area is gone)
**Flavor:** Arrows fall from nothing, again and again, until the ground is gone.

*Area • Ranged • Save • Shot • Weapon* · **Frequency:** Daily · **Target:** All enemies in the Area · **Area:** 3 Emanation ·
**Distance:** Your weapon's maximum range · **Vs:** Instinct Save

| | 2 AP |
|---|---|
| **Tier 1** | [B] 2d8 + [Mod] Pi; Prone. |
| **Tier 2** | [B] 2d6 + [Mod] Pi |
| **Tier 3** | [B] 1d6 Pi |

*Price:* 22.1 (2.37): **on target** (was 3 AP 11.4, 0.82, with an area lasting 2 rounds [HT] that the ruler can't price and B2 hasn't
written). The area Daily; it targets enemies only (a Daily's privilege, as Word of Radiance).

### Passive Escalation Pick (levels 1 and 3). Defaults: Killer's Focus (1.6 DE a turn weighted, 7%), Elusive (no damage: Downs 7-8% fewer)

#### Harrying Shots (Archer Escalation, Passive) · NEW, the support option
**Flavor:** Every arrow says the same thing: not yet.

While your Escalation is 1 or more, the first time each round you deal damage to your Marked Quarry with a [Shot] Action, they take 1 Bane on [Strike] Actions until the end of their next turn.

*Price (by hand):* 1 Bane on one enemy's Strikes for its turn = 1.18 DE (prices.md section 2), × 80% (the first Shot at the quarry lands)
× 77% (Escalation 1 or more) = **0.7 DE a turn, 3%**, plus what it saves the party in Downs (like Elusive, not in DE). It is the "Bane on
their Strikes" of the Archer's control kit; Elusive protects the Archer, this protects whoever the quarry attacks.

### Active Escalation Pick (level 1). Default: Pinning Shot (8.9 a use; **3.5 DE a turn**)

| Option | Escalation | Per use | DE a turn | Job |
|---|---:|---:|---:|---|
| **Pinning Shot** (default) | 2 | 8.9 | 3.5 | Immobilized (EoT) |
| **Twin Shot** (Escalation 3, decided) | 3 | 16.0 | 3.3 | damage on two creatures |
| **Vanish** | 1 | 3.4 (14%) | 3.0 | the step away, +1 Defense |

#### Twin Shot (Archer Escalation) · 1 AP · the book's old card, Escalation 3 (decided 2026-10-29)
**Flavor:** Two arrows, one motion, two answers.

*Ranged • Shot • Strike • Weapon* · **Escalation:** 3 · **Frequency:** Round · **Target:** Two creatures · **Distance:** Weapon

| 1 AP |
|---|
| Make one [Ranged, Shot] Weapon Attack (1A) and compare its result to two different creatures no more than 5 squares apart. It deals an extra [B] 1d6 Pi to each of them. |

*Price:* 16.0 a use (3.44, over per use), 0.88 uses a fight: **3.3 DE a turn**, the same as Pinning Shot. Escalation 3 is the cost.

#### Vanish (Archer Escalation) · 0 AP · reworked (was 1 AP, under; its Bane was Elusive's)
**Flavor:** You were there a moment ago. You are not now.

*Self* · **Escalation:** 1 · **Frequency:** Round

| 0 AP |
|---|
| Evade 2. You gain +1 Defense until the start of your next turn. |

*Price:* 3.4 a use (14% of a turn, on target for 0 AP), **3.0 DE a turn**. The old "first Strike against you takes 1 Bane" is Elusive's effect, so it became +1 Defense (the same kind of value, a different effect: they stack).

## 4. Cards left out (and why)

| Card | Was | Where it goes |
|---|---|---|
| Sacred Weapon | Paladin Round | **Talent** (Magic, Divine): any divine character could want it (section 5) |
| Champion's Challenge | Paladin Round (0.16) | **Talent** Challenge (Combat): a tank's tool for any class; no core tank mark (decided) |
| Long Draw, Steady Nerves | Archer passive, Escalation passive | **Talents** (Combat): any ranged character could want them |
| Call to Arms | Paladin Active (87% of a turn) | folded into Hand of Mercy |
| Suppressing Fire | Archer Round (0.07) | folded into Covering Fire |
| Judgment | Paladin Active (1.43) | out: priced on its band per turn (5.9 at Escalation 1), but it is the Paladin's own damage; in place of Divine Surge it put the build's sustained at 99% (budget 85-90%): off role |
| Divine Retribution | Paladin Encounter Reaction | out: a Reaction Nova is Holy Wrath's job, and it needs 2-3 AP kept |
| Rebuke | Paladin Turn Reaction | out: no Turn slot; Shield of Faith and Bulwark of Faith are the ward Reactions |
| Vow of Enmity | Paladin Round (0.4-0.5) | out: Divine Surge is the Paladin's mark |
| Mercy's Reward | Paladin passive | out: it needs both Signatures; Lay On Hands 2's rider and Font of Mercy do its job |
| Sanctified Ground | Paladin Active (0.56) | out: a small Consecrated Ground (the same kind) |
| Avenger's Oath | Paladin passive (0.1) | out: Radiant Zeal is the damage passive |
| Aegis, Divine Vigil | Paladin passives (Boons on Saves) | waiting: NPC Saves aren't in the ruler; candidates for a Talent later |
| Quick Draw | Archer Turn Reaction | out: the Talent Opportunity Attack's kind (the charter's overlap) |
| Wing Clip | Archer Round (1.71) | out: no Round slot; Lock & Loose and Pinning Shot are the crippling shots |
| True Shot | Archer Round (0.07) | out: the Talent Aim ignores Low Cover |
| Steady Aim | Archer Active (3%) | out: the Talent Aim's kind |
| Perfect Shot | Archer Active (Escalation 3, 16%, on target) | out for now: Twin Shot is the Escalation 3 damage option; it can come back as a fourth Active |
| Patient Hunter | Archer passive | out: against the role (it rewards standing still) and it needs "haven't moved" tracking |

They stay in paladin-old-cards.md and archer-old-cards.md (not built).

## 5. Talents

### The structure (for the book and for Foundry's Talent picker)

- **Category** (decided 2026-10-29 as traits): **Combat, Mobility, Magic, Skill**. The card's head says it: `Combat Talent 1` (category,
  then the Level). Skill Talents come with D3 (Skills).
- **Level:** the level you need to take it (1 for everything below except Class Expertise, 5).
- **Prerequisites** in a fixed form, so Foundry can check them: a list of items, each one of: a **Talent** ("Brawler"), a **Level**
  ("Level 5"), an **Action with a trait** ("a [Divine] Action"), an **Attribute** ("Body 2"). Anything else is "Other" (free text, not checked).
- **Themes** (decided: chains of 2 or 3 keyed on a trait or a theme): the chain is written by the Prerequisites; the theme's name is a tag the picker can filter by.
  Today's chains: Unarmed (Brawler → Kickboxer), Great Weapon (Heavy Blows → Whirlwind), Marksman (Aim → Ricochet), Divine (Lesser Blessing → Sacred Weapon).
- **The budget (proposed; model A means no sustained growth inside Stage 1):** an **Action Talent** sits on its Frequency's band (it replaces
  another Action, so it adds only its margin); a **passive Talent** is worth at most about **5% of a baseline turn (1.2 DE)** when it applies, or
  gives a value that isn't damage (movement, utility, defense). Talents are left out of the class builds (decided): a PC with two Talents runs
  up to about 10% over its class, which the Bestiary's 3½-round fights absorb (about 3.2 rounds).
- **No overlap** (the charter): a Talent never copies a class Action; effects of the same kind don't stack (section 6).

### The list (proposed; the book's order: Combat, Mobility, Magic, then Class Expertise)

| Talent | Category · Prerequisites | Change | Price |
|---|---|---|---|
| **Opportunity Attack** (1R) | Combat | unchanged | a Weapon Attack (1.15) when used; worth 0 to a Paladin that spends 5 AP (E2) |
| **Challenge** (passive) | Combat | NEW (Champion's Challenge reworked) | 0.6 DE a turn (2-3%) + not modeled: it draws attacks to you |
| **Heavy Blows** (passive) | Combat | changed: +2 on a Tier 3 (was +1 on every hit: 10%) | about 1.5 DE a turn (6-7%; +1 would be 3%) |
| **Whirlwind** (2 AP, Encounter) | Combat · Heavy Blows | changed numbers; now after Heavy Blows | 14.0 (1.50, on target; was 1.15) |
| **Bloodlust** (1 AP, Encounter) | Combat | changed: 2 Boons (was 1) | 7.7 (1.65, on target; was 1.29) |
| **Brawler** → Pummel (1 AP, At-will) | Combat | unchanged | 4.1 (0.87, a little under: Fists) |
| **Kickboxer** → Leg Sweep (1 AP, Round) | Combat · Brawler | changed: Prone on a Tier 3 instead of a free Pummel | 4.5 (0.97; with the free Pummel it was about 1.7, over) |
| **Aim** (1 AP, Round) | Combat | changed: now an attack with 1 Boon that ignores Low Cover | 6.3 (1.36, a little over; was 0.11) |
| **Ricochet** (passive) | Combat · Aim | changed: a passive, a bounced shot takes 1 Bane (was 1 AP) | utility (Line of Effect around cover) |
| **Long Draw** (passive) | Combat | NEW here (from the Archer) | 0.5 DE a turn (2%) |
| **Steady Nerves** (passive) | Combat | NEW here (from the Archer's Escalation, now always on) | 0.1 for a kiting Archer; 2.0 (8%) for a ranged character that stands |
| **Battering Charge** (passive) | Mobility | unchanged | about 1 DE a Charge (Empowered 1 on one attack); Speed is worth little on an open field (E2) |
| **Cut Through** (2 AP, Round) | Mobility | unchanged | 8.6 (0.93, a little under; moving through creatures isn't priced) |
| **Lesser Blessing** → Rimebrand (1 AP, Round) | Magic | changed: a turn buff, no roll (was a DC 13 roll for one Strike: about 0.45) | about 5.6 (1.2, on target; by hand) |
| **Sacred Weapon** (1 / 2 AP, Round) | Magic · Lesser Blessing or a [Divine] Action | NEW here (from the Paladin) | 4.2 / 8.5 (0.91, a little under) |
| **Class Expertise** | Combat · Level 5 | NEW (the charter) | another Encounter or Daily of your class: on its band |

### The new and changed cards (as they would read in the book)

#### Challenge (Combat Talent 1) · NEW
**Flavor:** You call them out, and they cannot look away.

Once per round, when you deal damage to a creature with a [Melee, Strike] Action, you can challenge them: until the end of their next turn, their [Strike] Actions against creatures other than you take 1 Bane.

#### Heavy Blows (Combat Talent 1) · changed
**Flavor:** Every swing carries the whole weight of the steel.

When a [Melee, Strike, Weapon] Action you make with a Two-handed weapon deals damage on a Tier 3, it deals 2 more.

*Why:* +1 on every hit was 2.4 DE a turn (10%): the charter's old growth step, against model A. A Tier 3 comes on about a quarter of the attacks: about 1.5 DE a turn (6-7%), a little over the 5% guide (+1 on a Tier 3 would be 3%).

#### Whirlwind (Combat Talent 1) · changed · **Prerequisites:** Heavy Blows
*Area • Melee • Self • Strike • Weapon* · Encounter · 2 AP · 1 Emanation · Vs AD: **Tier 1** [B] 1[W] + [Mod] · **Tier 2** [B] 1[W] + [Mod] + 4 · **Tier 3** [B] 1[W] + [Mod] + 6 (was [Mod] / +1 / +3). Flavor unchanged.

#### Bloodlust (Combat Talent 1) · changed
1 AP, Encounter, Self: for 1 round, your [Melee, Weapon] Actions are Empowered 1 and gain **2 Boons**, and you take 1 Bane on Saves. Flavor unchanged.

#### Leg Sweep (Weapon Technique, Kickboxer) · changed
**Flavor:** A low kick takes their legs out from under them.

1 AP, Round, [Melee, Strike, Weapon], Requirements: a free hand · **Tier 1** [B] 1d4 Bl · **Tier 2** [B] 1d4 + [Mod] Bl · **Tier 3** [B] 1d6 + [Mod] Bl; Prone.

#### Aim (Combat Talent 1) · changed
**Flavor:** Patience turns a good shot into a sure one.

*Ranged • Strike • Weapon* · **Frequency:** Round · **Target:** One creature · **Distance:** Weapon

| 1 AP |
|---|
| Make a [Ranged] Weapon Attack (1A) with 1 Boon. It ignores Low Cover. |

*Why:* "1 AP for a Boon on your next shot" was worth 0.11 of its band (a Boon is 0.5 DE, an AP 4.66): no Action can be on band that way.

#### Ricochet (Combat Talent 1) · changed · **Prerequisites:** Aim
**Flavor:** Walls, shields and stones are just more angles.

Your [Ranged, Weapon] Actions can bounce off one surface on the way: the projectile goes from the surface to the creature, and you calculate Line of Effect, Cover and Sight from the center of the surface; the distance is the total the projectile travels (a surface 5 squares away and a creature 6 squares from it: an 11-square shot). You must still perceive the creature. A bounced shot takes 1 Bane.

#### Long Draw (Combat Talent 1) · moved from the Archer
**Flavor:** You pull a little further, and the arrow flies a little truer.

With a Projectile weapon, your far range has no Bane and your maximum range has 1 Bane instead of 2.

#### Steady Nerves (Combat Talent 1) · moved from the Archer (no Escalation)
**Flavor:** They are in your face. You are still calm.

Your [Ranged] Actions don't take the Banes for being Engaged.

#### Rimebrand (Lesser Blessing) · changed
**Flavor:** Frost creeps along your weapon, a gift from a winter god.

*Divine • Power • Self* · **Frequency:** Round

| 1 AP |
|---|
| Until the end of your turn, your [Weapon] Actions deal an extra [M] 1d4 Co, and the first one that deals damage on a Tier 3 makes the target Hindered (EoT). |

*Price (by hand):* the P1 Paladin's turn after it (Smite 2, two Weapon Attacks) lands about 2.1 hits: 5.2 DE + Hindered about 0.4 = **5.6 (1.2, on target)**.

#### Sacred Weapon (Magic Talent 1) · moved from the Paladin · **Prerequisites:** Lesser Blessing, or a [Divine] Action
The old card unchanged (1 / 2 AP, Round, Divine Focus: you or an ally touched becomes Empowered 1 for 1 round, or Empowered 2 if already Empowered 1).

#### Class Expertise (Combat Talent 5) · NEW · **Prerequisites:** Level 5
**Flavor:** You have studied your craft longer than most.

Choose one Encounter or Daily Action from your class's Repertoire that you don't have. You gain it.

## 6. The overlap check

| Pair | Verdict |
|---|---|
| Aim (Talent) · Precise Aim (Archer) | solved in A1: Precise Aim left the class |
| Opportunity Attack (Talent) · Quick Draw (Archer) | solved: Quick Draw leaves |
| Steady Nerves (Talent) · Sharpshooter (Archer) | different Banes: Sharpshooter removes "into melee", Steady Nerves "while Engaged" |
| Sacred Weapon · Bloodlust · Hunter's Focus | all Empowered: Empowered doesn't stack, except Sacred Weapon's own "1 becomes 2" (its card) |
| Challenge (Talent) · Divine Surge (Paladin) | different jobs: Challenge pulls attacks to you; Divine Surge adds the party's damage |
| Rimebrand · Radiant Zeal · Divine Surge | different effects (extra dice from different sources stack); Radiant Zeal and Divine Surge are class, Rimebrand any divine character |
| Covering Fire (Archer) · Consecrated Ground (Paladin) | the same kind of zone in two classes (allowed: the charter forbids Talent-class copies, not class-class); Encounter against Daily |
| Vanish · Elusive (Archer) | solved: Vanish's Bane was Elusive's effect; Vanish gives +1 Defense now |
| Hand of Mercy (rescue) · Lay On Hands | the same rescue for a Lay On Hands Paladin (an Unconscious ally is willing): the option is worth less to it; fine |
| Heavy Blows · Battering Charge · Whirlwind | different triggers (Tier 3, Charge, area) |

## 7. The numbers (the simulated Standard day, with the E3 Bestiary)

`node book/ruler/econ.mjs`, prices.md section 3. Sustained (real) = the damage a turn on the turns without an Encounter or Daily Action.

| Build | Sustained (real) | Best Nova | All turns | Health | Note |
|---|---:|---:|---:|---:|---|
| P1 Smite L1 (defaults) | 19.2 (82%) | 38.8 (166%) | 24.1 (103%) | 39 (124%) | was 86% sustained before the E3 Bestiary |
| P1 Smite L1 + Word of Radiance + Aura of Protection | 18.2 (78%) | 21.7 (93%, one creature) | 21.8 (94%) | 39 (124%) | the area Nova lands on 2 targets in the fight; Aura instead of Divine Surge's own Guard |
| A1 Double Shot L3 (defaults) | 25.3 (109%) | 33.4 (143%) | 26.0 (112%) | 31 (85%) | |
| A1 Double Shot L3 + Volley + Deadeye + Twin Shot | 25.2 (108%) | 35.6 (153%, Volley's whole area) | 26.0 (112%) | 31 (85%) | the same day as the defaults |

- **The options hold the role.** The Archer's option build deals the same damage as its defaults (108% against 109%; all turns 112% both).
  The Paladin's area Nova deals less in the fight than on the price list (an area 2.5 hits 2 creatures in the sim, fewer when they spread):
  if you want it equal in the days too, raise Word of Radiance 3 one die step (question 2).
- **Judgment** (a damage Active) put the Paladin at 99% sustained in place of Divine Surge (the role is 85-90%): left out.
- **Deadeye at 2 AP** put the Archer's best turn at 169%: written at 1 AP.

## 8. Decision sheet (answer by exception: "all defaults except 3")

1. **The slot rules:** a slot is Encounter, Daily, Passive or Active Escalation, with 2 to 4 options each; Round and Turn cards have no slot in levels 1-3 (they become Escalation Actives or Talents, or leave: section 4). **[yes]**
2. **The Paladin's options** (section 2): Word of Radiance as the Power Nova (as priced), Divine Intervention 2R only, Miraculous Recovery, Mending Light (new), Shield of Faith as a 0R Active Escalation with 1d8 + [Mod], Hand of Mercy with Call to Arms in it. **[yes]** (or: Word of Radiance 3 one die step higher, equal in the days)
3. **The Archer's options** (section 3): Volley 2 AP, Covering Fire with Suppressing Fire in it, Deadeye 1 AP Favored, Rain of Arrows 2 AP without the lasting area, Twin Shot, Vanish 0 AP with +1 Defense, Harrying Shots (new). **[yes]**
4. **The Talent rules** (section 5): the category in the head (Combat / Mobility / Magic / Skill), Level and Prerequisites in a fixed form (the picker reads them), a passive Talent at most about 5% of a turn; Heavy Blows cut to "+2 on a Tier 3". **[yes]**
5. **Cards that become Talents:** Sacred Weapon (Magic), Challenge (Combat, from Champion's Challenge), Long Draw and Steady Nerves (Combat); Aim and Ricochet reworked. **[yes]**
6. **Class Expertise** written now as a level 5 Talent (it does nothing until levels 5+ are written). **[yes]**

## 9. Assumptions I made

1. Escalation Actives are compared per turn (uses a fight × price ÷ rounds), not per use: Escalation is their limit (Twin Shot is 3.44 per use, but 3.3 a turn, Pinning Shot's 3.5).
2. A Reaction Daily is priced net of the AP it keeps (E2: 1.78 DE a turn for each AP kept), so Divine Intervention 2R (3.66 on paper) is on its band when held about two turns.
3. Hand-priced cards (the spec format can't hold them): Mending Light (a passive heal), Harrying Shots (a Bane from a passive), Rimebrand (an extra die for the turn), Challenge (a per-hit taunt), Heavy Blows on a Tier 3 (the turn's attacks: Smite 2, then two Weapon Attacks with 0 and 1 At-will Bane: Tier 3 on 27%, 27% and 23%).
4. Bulwark of Faith 2R stays under (0.97): it is your round 6 card and the 2R is a choice inside a card that is on target at 1R.
5. Covering Fire's "allies in it gain +1 Defense" and its Bane both stay: they are different effects (they stack), and without the Defense it was 0.76.
6. The old lasting areas ([HT]: Covering Fire's 1d4 on entering, Rain of Arrows' 2 rounds) are gone: the ruler can't price hazardous terrain and B2 hasn't written [HT]. They can come back as Overcast-like Versions after B2.
7. Class Expertise's category is Combat (it gives class Actions; a caster class's version can say Magic later).
8. **The ruler fix** (section 0): `econ.mjs` and `spec.mjs` read E3's Bestiary (Stage tables, CV ×100); prices.md and report.md are regenerated with it, so the P1 and A1 rows in them moved by 0 to 4 points (P1 Smite L1 sustained 86% → 82%; A1 Double Shot L1 102% → 103%). Nothing in rules-src changed.
9. The two option builds in `classes/` take one option per slot they test; the rest stays the default.
