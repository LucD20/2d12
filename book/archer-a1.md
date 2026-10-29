# The Archer main build (pack A1, 2026-10-29): PROPOSED, waiting for Lucas

> **Round 2 (Lucas's notes, 2026-10-29), applied here:** Double Shot's Linked attacks are **[Ranged, Shot] Weapon Attacks (1A)** (Rolling Shot's
> too, for the same reason); **Double Shot and Rolling Shot lose the Signature trait** (they make no roll themselves: the trait only sets the
> Modifier an Action rolls, and a Signature Class Action doesn't need it); **Chapter 1, Rules Language: "Weapons by property"** (a Projectile
> weapon is a weapon with the Projectile property) is in the book. Firearms: section 8. The numbers don't change (the ruler never used the trait here).

Written to `book/class-charter.md` and the progression model A (`book/progression-lv.md`: no sustained growth inside tier 1). **Nothing here is
in `book/rules-src` yet**: you approve (or change) the cards first, then they go into the book (`13-archer.md`), then Foundry (pack C).
The ruler files are `book/ruler/classes/archer-double-1..3.txt` and `archer-rolling-1..3.txt` (one per Signature); the cards are priced in
`book/ruler/catalogue/archer-a1.txt`; the numbers come from `node book/ruler/econ.mjs` (prices.md sections 3 and 4) and `node book/ruler/spec.mjs`
(report.md, the days "A1 Double Shot" and "A1 Rolling Shot"). `classes/archer-1..3.txt` are today's Archer, kept to compare (and as the
Paladin's partners in the price list).

## 1. The level list

| Level | What you gain (default in brackets) |
|---|---|
| **1** | 2 Features (Sharpshooter, Marked Quarry) · 1 Signature Class Action: **Double Shot or Rolling Shot** · 1 Talent · 1 Passive Escalation (Killer's Focus) · 1 Active Escalation (Pinning Shot) |
| **2** | 1 Encounter Pick (Marksman's Shot) · 1 Talent |
| **3** | 1 Daily Pick (Hunter's Focus) · 1 Passive Escalation (Elusive) |

The charter's template as it is (the Archer's Nova budget is low, so its Encounter Pick stays at level 2). Stat box unchanged (Health 27 at level 1: 86% of the baseline).

## 2. The cards (as they would read in the book)

Price = damage-equivalents (DE) at level 1; efficiency = DE per AP ÷ 4.66 (the price of 1 AP); bands: Round 1.0-1.3, Encounter 1.4-2.0, Daily 2.0-3.0.
Passives are priced in the simulated Standard day (1,000 days, the same dice with and without them).

### Sharpshooter (Archer Feature 1) · changed
**Flavor:** You were made for the shot no one else would take.

Choose your Signature Class Action: **Double Shot** or **Rolling Shot**. Choose one [[Projectile]] weapon, such as a bow or a crossbow: you start
with **3 Mastery** with it. Your [Shot] Actions don't take the Bane for targeting a creature Engaged with a creature other than you.

*Price:* the clear shot is worth +1.0 to 1.2 DE a turn (4-5%): E2 found the into-melee Bane on 72% of the Archer's shots, its biggest cost. Bow
Mastery (Lock & Loose) is folded in, as P1 folded Profane Judgment into Divine Power, so the class keeps two Features.

### Marked Quarry (Archer Feature 1) · changed (your decision of 2026-10-29: the floor)
**Flavor:** You pick the one, and the world narrows.

At the start of each encounter, choose one enemy as your **Marked Quarry**. You gain 1 Boon on [Shot, Strike] Actions against them, and those
Actions deal [B] [Mod] on a Tier 1. When they die or go Down, you can choose a new Marked Quarry (0R [Focus]). Once per turn, you can change your
Marked Quarry during an encounter by spending 1 AP [Focus].

*Price:* the Boon +1.1 to 1.5 DE a turn (5-6%), the floor +1.6 (7%).

### Double Shot (Sharpshooter 1) · 2 / 3 AP · Signature Class Action, changed
**Flavor:** Two shots, so close together they sound like one.

*Shot • Strike* · **Frequency:** Round · **Target:** Two creatures

| 2 AP | 3 AP |
|---|---|
| You make two [Ranged, Shot] Weapon Attacks (1A), each against a different creature. | Evade 1, then as 2 AP. |

*Price:* 2 AP 11.0 (1.18, on target); 3 AP 13.2 (0.94, a little under; was 12.0, 0.86 with its two Boons). The 3 AP Version is now the step
away: the damage Signature with a mobility rider.

### Rolling Shot (Sharpshooter 1) · 1 / 2 / 3 AP · Signature Class Action, changed (was a Round Pick)
**Flavor:** You keep moving, and the shot rides along with the motion.

*Ranged • Shot • Strike • Weapon* · **Frequency:** Round · **Target:** One creature · **Distance:** Weapon

| 1 AP | 2 AP | 3 AP |
|---|---|---|
| Evade 1, then make a [Ranged, Shot] Weapon Attack (1A). | Evade 2, then make a [Ranged, Shot] Weapon Attack (1A) that deals an extra [B] 1d6 Pi. | Evade 3, then make a [Ranged, Shot] Weapon Attack (1A) that deals an extra [B] 2d6 Pi. |

*Price:* 1 AP 7.7 (1.65, over: the book's card, kept as P1 kept Smite 1); 2 AP 10.2 (1.10, on target); 3 AP 12.7 (0.91, a little under). The
mobility Signature with a damage rider: it never spends an AP on stepping away.

### Killer's Focus (Archer Escalation, Passive) · the book's card, unchanged; the level 1 default
While your Escalation is 2 or more, your first [Shot, Strike, Weapon] Action each round deals an extra [B] 1d6 Pi. *Price:* +0.7 to 0.9 DE a turn in the days (3-4%).

### Pinning Shot (Archer Escalation) · the book's card, unchanged; the level 1 default
Escalation 2, 1 AP, Round: make a [Ranged] Weapon Attack (1A); on a Tier 2 or 3, the target is Immobilized (EoT). *Price:* 8.9 (1.91, over:
Immobilized (EoT) is worth an AP, 4.7). **The level 1 pair is a real choice:** spending 2 turns Killer's Focus off. In the days, spending deals
the same damage as holding (103% against 104%) and Immobilizes 2.5 NPCs a day.

### Marksman's Shot (Archer Encounter) · 2 AP · changed; the level 2 default
**Flavor:** One shot, carefully placed. Everything after it is easier.

*Ranged • Shot • Strike • Weapon* · **Frequency:** Encounter · **Target:** One creature · **Distance:** Weapon · **Vs:** AD

| | 2 AP |
|---|---|
| **Tier 1** | [B] 1[W] + 1d8 Pi |
| **Tier 2** | [B] 1[W] + [Mod] + 3d6 Pi |
| **Tier 3** | [B] 1[W] + [Mod] + 4d6 Pi; Vulnerable 2 (EoT). |

*Price:* 16.0 (1.71, on target; was 6.3, 0.68). The Bane on the next Save is gone (NPC Saves are not modeled, and it was most of the old card's text for none of its value).

### Hunter's Focus (Archer Daily) · the book's card, unchanged; the level 3 default
*Price:* 13.0 (2.79, on target). It lasts the encounter, so in the hard fight it lifts the turns after it (+4% of the level 3 sustained damage).

### Elusive (Archer Escalation, Passive) · NEW, the level 3 default
**Flavor:** You are never quite where they aimed.

While your Escalation is 1 or more, the first [Strike] Action against you each round takes 1 Bane.

*Price:* no damage; the Archer goes Down 0.04 to 0.05 times less a day (7-8%). A defensive passive on purpose: model A gives no sustained growth inside tier 1.

## 3. The budget table

Shares of the baseline PC (23.3 damage a turn; model A: the same at levels 1-3; Health against 31.5 / 34.0 / 36.5). **Sustained** = the damage a
turn in the simulated Standard day on the turns without an Encounter or Daily Action (Momentum on). **Nova (best)** = the best turn with the
Encounter or Daily at the Escalation Momentum starts with; **Nova (real)** = the Nova turns of the days. The party: 2 P1 Smite Paladins + 2 of the build.

| Build | Sustained (100-105%) | Nova best / real (110-130%) | All turns | Health (80-85%) | Standard day cleared |
|---|---:|---:|---:|---:|---:|
| Today's Archer, L1 | 22.4 (96%) | 19.2 (82%) / 15.7 (67%) | 20.8 (89%) | 27 (86%) | 79% |
| **A1 Double Shot, L1** | 23.9 (102%) | - | 23.9 (102%) | 27 (86%) | 87% |
| **A1 Rolling Shot, L1** | 24.1 (104%) | - | 24.1 (104%) | 27 (86%) | 88% |
| A1 Double Shot, L2 | 24.1 (104%) | 30.0 (129%) / 27.3 (117%) | 24.9 (107%) | 29 (85%) | 65% |
| A1 Rolling Shot, L2 | 24.1 (103%) | 28.9 (124%) / 28.2 (121%) | 25.1 (108%) | 29 (85%) | 69% |
| A1 Double Shot, L3 | 25.5 (109%) | 33.4 (143%) / 28.7 (123%) | 26.7 (114%) | 31 (85%) | 95% |
| A1 Rolling Shot, L3 | 25.7 (110%) | 32.4 (139%) / 29.9 (128%) | 27.2 (117%) | 31 (85%) | 96% |

- **Level 1 and 2 are in budget** for both Signatures, with low variance (the Archer's role). Rolling Shot is a little stronger and safer
  (Down 0.56 a day against 0.65: it never stops to step away).
- **Level 3 is over by 4-5 points** (sustained 109-110%, best Nova 139-143%), from two things that aren't cards: **Momentum starts fights at
  Escalation 2 from level 3** (decided in LV), which turns Killer's Focus on in round 1, and Hunter's Focus lifting the turns after it in the
  hard fight. Without Hunter's Focus the level 3 sustained is 105%. The real Nova (123-128%) is in band. Question 5.
- **Level 2 is the hard level** (the day cleared 65-69%, the P1 party with today's Archer 56%): the Bestiary grows NPC Health 14% at level 2.
  E3 refits it to model A (flat inside tier 1), which fixes this.
- **Shots into melee: 29 a day → 0.** Positions now cost the Archer 0-2% (was 21%: the "No positions" column of prices.md).
- The Archer's control in a day: Hindered 4.9, Immobilized 3.1 (Lock & Loose), Immobilized (EoT) 2.5 (Pinning Shot).

## 4. What changed from today's Archer

- **Features:** Sharpshooter gives the Signature choice, carries Bow Mastery (no longer its own Feature) and removes the into-melee Bane; Marked Quarry gains the floor ([B] [Mod] on a Tier 1, decided).
- **Signature Class Action** instead of two Class Actions: **Double Shot** (its 3 AP Version is now "Evade 1, then as 2 AP", was two Boons) or **Rolling Shot** (from the Repertoire, with a 3 AP Version and extra damage on 2 and 3 AP; was Evade 3 + 1 Boon at 2 AP).
- **Precise Aim leaves the class**: the Talent Aim is the same Action, only better (the charter's overlap); it was priced at 0.11 of its band.
- **Level list:** the charter's template (a Talent at levels 1 and 2; no "Pick from any list"; one Passive Escalation at level 3, not at 2 and 3).
- **Marksman's Shot** reworked to the Encounter band; **Elusive** is new. Defaults kept from the book: Killer's Focus, Pinning Shot, Hunter's Focus.
- Not touched (they become options for the Options step): Long Draw, Quick Draw, Wing Clip, True Shot, Suppressing Fire, Volley, Covering Fire, Rain of Arrows, Deadeye, Patient Hunter, Steady Nerves, Steady Aim, Vanish, Twin Shot (Escalation 3, decided), Perfect Shot.

## 5. Decision sheet (answer by exception: "all defaults except 3")

1. **The Signatures:** Double Shot (damage, a step away at 3 AP) or Rolling Shot (moves every shot, extra damage at 2-3 AP)? **[yes]**
2. **Sharpshooter:** Bow Mastery folded in, and no Bane for shooting at a creature Engaged with someone else; Precise Aim leaves the class (the Talent Aim)? **[yes]**
3. **Marksman's Shot** reworked as above (its Save Bane gone), the level 2 default? **[yes]**
4. **Elusive** (new) as the level 3 Passive Escalation default, Hunter's Focus as the level 3 Daily? **[yes]**
5. **Level 3 is 4-5 points over** because of Momentum 2 at level 3 and Hunter's Focus: accept it as the tier's own growth **[yes]**, or move Momentum 2 to level 5 (the start of tier 2: no growth inside tier 1 at all, for every class)?

## 6. Assumptions I made

1. Sustained is measured in the Standard day on the turns without the Encounter or Daily Action (as P1), against 23.3 at levels 1-3 (model A; prices.md now uses model A for its bracketed numbers).
2. Each Signature covers the whole role: the "small rider from the other side" is the step away (Double Shot 3 AP) and the extra damage (Rolling Shot 2 and 3 AP).
3. The into-melee rule goes on a Feature, not a Talent: it is the Archer's fantasy ("the shot no one else would take") and E2's biggest cost.
4. Pinning Shot is the Active default (not Twin Shot, now Escalation 3: once in two fights) so the level 1 pair competes for Escalation 2.
5. The ruler: the Archer spends Escalation on Pinning Shot when it has 2 (a Weapon Attack otherwise); it takes its Kite turn when it starts Engaged (the Signature's Evade is its step away); Hunter's Focus's damage reduction against the quarry is not modeled; Elusive counts the first NPC Strike each round against the Archer.
6. `spec.mjs` learned: `floor` (a Tier 1 damage passive), `clear-shot` (no into-melee Bane), `elusive N`, effects that last the `encounter`, and `(else Weapon Attack)` in a turn. The other class files and their numbers don't change, except the price list's level 2-3 brackets (model A).

## 7. Found on the way (for you, not changed)

- **The P1 Paladin's Radiant Zeal** (its level 3 Passive Escalation: +1d6 on the first Strike) gives it +11% sustained at level 3: against model A. For the Options step: a non-damage passive there, as Elusive is for the Archer.
- Question 5 is the same for the Paladin: its level 3 numbers also rise with Momentum 2.

## 8. Round 2 (Lucas's notes, 2026-10-29)

- **"X weapon" in the Rules Language: APPLIED** (Chapter 1, Rules Language, "Weapons by property"): a rule that names a property before
  "weapon" means a weapon with that property (a Two-handed weapon, a Projectile weapon).
- **[Ranged, Shot] Weapon Attacks:** Double Shot (as you wrote) and Rolling Shot (my addition: the same reason).
- **The Signature trait:** off both cards. Making their Linked attacks roll the Signature Modifier would only matter for an Archer whose Power
  Modifier is higher than its Weapon Modifier, and would add a rule for it. **For the book (with these cards):** Chapter 5 says a Signature Class
  Action needn't have the Signature trait (Smite has it because it rolls; Double Shot doesn't).
- **Classes needn't be symmetrical** (noted in the class charter, section 3): one class can offer three Signatures or start with two, another
  more Escalation (the Gladiator: "gathering the crowd"). The Archer and the Paladin stay as they are.
- **Firearms (your question: now or later?). My recommendation: decide the direction now, build it in D2 (Weapons and Gear).** The fix is in
  the weapon, not the Archer: **firearms get their own property, Firearm, and are not Projectile weapons.** Then Shot Actions (which need a
  Projectile weapon) and every Archer card stay bows and crossbows with no new wording, and a future gunslinger class (or a Firearm Talent tree)
  gets its own trait for gun Actions. Nothing in the book has firearms yet, so nothing breaks before D2. Question 6.

6. **Firearms are their own property (Firearm), not Projectile**, so the Archer's Shot cards never work with guns (built in D2)? **[yes]**
