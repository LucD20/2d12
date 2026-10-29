# The Paladin main build (pack P1, 2026-10-29): PROPOSED, for Lucas to approve

Written to `book/class-charter.md`. Nothing here is in `book/rules-src` yet: you approve (or change) the cards first, then they go into the book,
then Foundry. The ruler files are `book/ruler/classes/paladin-smite-*.txt` and `paladin-hands-*.txt` (levels 1 to 3; `paladin-smite-1-hold`
is the same build holding its Escalation), the cards are priced in `book/ruler/catalogue/paladin-p1.txt`, and the numbers come from
`node book/ruler/econ.mjs` (prices.md) and `node book/ruler/spec.mjs` (report.md). `classes/paladin-book-1.txt` is today's Paladin, kept to compare.

## 1. The level list

| Level | What you gain (default in brackets) |
|---|---|
| **1** | 2 Features (Divine Power, Font of Mercy) · 1 Signature Class Action: **Smite or Lay On Hands** · 1 Talent (Opportunity Attack) · **1 Encounter Pick (Holy Wrath)** · 1 Passive Escalation (Hallowed Stance) · 1 Active Escalation (Divine Surge) |
| **2** | 1 Talent (Heavy Blows, a stand-in until the Talents pack) |
| **3** | 1 Daily Pick (Consecrated Ground) · 1 Passive Escalation (Radiant Zeal) |

The charter's template with the level 2 Encounter Pick moved to level 1 (the charter: "the template's level 2 Pick moves"). Stat box: **Mind Health Multiplier ×4** (was ×3); the rest unchanged.

## 2. The cards (as they would read in the book)

Price = damage-equivalents (DE) at level 1; efficiency = DE per AP ÷ 4.66 (the price of 1 AP); bands: Round 1.0-1.3, Encounter 1.4-2.0, Daily 2.0-3.0; a 0 AP Action 8-25% of a turn.

### Divine Power (Paladin Feature 1) · changed
**Flavor:** Your god's strength flows through your weapon and your hands.

Choose your Signature Class Action: **Smite** or **Lay On Hands**. You gain it.
When you deal Holy damage to a creature with the Profane Tag, that creature is Enfeebled 1 (EoT).

*Price:* the Signature (below); Profane Judgment (folded in, unchanged) isn't priced (it needs Profane creatures). *Verdict:* -.

### Font of Mercy (Paladin Feature 1) · NEW
**Flavor:** Where you kneel, wounds remember how to close.

When you or an ally within 5 squares of you uses a Rally Point, they heal 2 more. (This doesn't stack with another Font of Mercy.)

*Price:* about 1.1 DE a Paladin turn with two Paladins in the party (they share it), about 2.2 with one; in the simulated Standard day it adds 12 to 17 Health a day per Paladin (in and between fights). *Verdict:* the Paladin's always-on healing (the "support worth real value" part that doesn't need positions).

### Smite (Divine Power 1) · 1 / 2 / 3 AP · Signature, changed
**Flavor:** Your weapon blazes with holy light.

*Divine • Signature • Strike • Weapon* · **Frequency:** Round · **Target:** One creature · **Distance:** Weapon · **Vs:** AD

(Lucas 2026-10-29: Smite has the Signature trait, so it rolls the Signature Modifier, the higher of Weapon and Power.)

| | 1 AP | 2 AP | 3 AP |
|---|---|---|---|
| **Tier 1** | [B] 1[W] | [B] 1[W] + [M] 1d6 Ho | [B] 1[W] + [M] 1d6 Ho |
| **Tier 2** | [B] 1[W] + [Mod] + [M] 1d4 Ho | [B] 1[W] + [Mod] + [M] 1d10 Ho | [B] 1[W] + [Mod] + [M] 1d10 Ho |
| **Tier 3** | [B] 1[W] + [Mod] + [M] 1d6 Ho | [B] 1[W] + [Mod] + [M] 2d8 Ho | [B] 1[W] + [Mod] + [M] 2d8 Ho |
| **Effects** | The target sheds Bright light in a 1 Emanation and takes 1 Bane when they try to hide, for 1 round. | As 1 AP, but a 2 Emanation. You or one ally in the light gain +1 Defense for 1 round. | As 2 AP, and you or one ally in the light heal 1d8. |

*Price:* 1 AP 7.4 (1.60, **over**: unchanged from the book; a Round Strike skips the At-will Bane, and Smite 1 + two attacks is still the weakest full turn) · 2 AP 12.1 (1.30, on target) · 3 AP 17.1 (1.22, on target: 11.2 damage + 0.9 Defense + 5 new Health).
The support rider is the "small rider from the other side" (charter section 2): healing and Defense for whoever is near the target.

### Lay On Hands (Divine Power 1) · 1 / 2 / 3 AP · Signature, changed
**Flavor:** Your touch carries your god's mercy.

*Divine • Focus* · **Frequency:** Round · **Target:** One willing creature · **Distance:** Reach

| 1 AP | 2 AP | 3 AP |
|---|---|---|
| The target can use 1 Rally Point. | As 1 AP, and your next [Strike] Action this turn deals an extra [M] 2d8 Ho. | As 2 AP, but the target can use up to 2 Rally Points. |

*Price:* 1 AP 8.8 (1.89) · 2 AP 15.3 (1.64) · 3 AP 24.1 (1.72): **over** on the price list, which counts every use as a full Rally Point; but the Rally Point is the ally's own, and in the day it heals only when someone is hurt (the sim: at least 3/4 of a Rally Point missing). In the Standard day the 2 AP is used every turn (the rider always works) and heals 48.7 Health a day, about 4.3 a turn; per turn it is on budget (section 3).

### Holy Wrath (Paladin Encounter) · 2 / 3 AP · NEW, the level 1 Encounter Pick
**Flavor:** For one blow, your god stops holding back.

*Divine • Strike • Weapon* · **Frequency:** Encounter · **Target:** One creature · **Distance:** Weapon · **Vs:** AD

| | 2 AP | 3 AP |
|---|---|---|
| **Tier 1** | [B] 1[W] + [M] 2d6 Ho | [B] 1[W] + [M] 3d8 Ho |
| **Tier 2** | [B] 1[W] + [Mod] + [M] 3d8 Ho | [B] 1[W] + [Mod] + [M] 5d8 Ho |
| **Tier 3** | [B] 1[W] + [Mod] + [M] 4d8 Ho | [B] 1[W] + [Mod] + [M] 7d8 Ho |

*Price:* 2 AP 18.3 (1.96, on target) · 3 AP 27.8 (1.99, on target; Tier 3 7d8, Lucas 2026-10-29). It is the Nova: Holy Wrath 3 + Smite 2 = 38.8 (166% of the baseline turn); Lay On Hands 2 + Holy Wrath 3 = 36.5 (157%). Single target on purpose: the Nova is measured on one creature. Word of Radiance (the area version) stays an option.

### Divine Surge (Paladin Escalation) · changed (the support version you chose)
**Flavor:** You name the foe in your god's sight, and every blade that finds it burns.

*Divine* · **Escalation:** 1 · **Frequency:** Round · **Target:** One enemy · **Distance:** 5 sq.

| 0 AP |
|---|
| The next time an ally deals damage to the target before the start of your next turn, they deal an extra [M] 1d8 Ho. |

*Price:* 4.0 a use (17% of a turn, on target for 0 AP; 90% that an ally hits it in time); about 2.9 uses a fight with Momentum. In the day: 18 to 20 extra damage a day for the party (not counted in the Paladin's own damage).

### Hallowed Stance (Paladin Escalation, Passive) · the book's card, unchanged; the level 1 default
While your Escalation is 2 or more, if you haven't left your square since your last turn, you and your adjacent allies take less Body damage, reduced by your Power Modifier (minimum 0). (One instance per Action.)

*Price:* 7.2 DE a turn while on (17% of a turn weighted by how often it is on).

**Spend now or hold (charter section 6):** Divine Surge costs 1, Hallowed Stance needs 2. Spending every round gives about 18.5 extra party damage a day and Hallowed Stance never turns on; holding (spending only above 2: `paladin-smite-1-hold`) gives 6.2 extra damage and 10.6 damage reduced. In DE the two are even (18.5 against 6.2 + 11.7), so the choice is real; holding is better for the tank's survival (Downs a day 0.82 against 1.30, the day cleared 93% against 83%), spending is better when the fight is short.

### Opportunity Attack (Talent 1) · the book's Talent; the level 1 default
A Reaction (not modeled by the ruler, so not in the numbers).

### Heavy Blows (Talent 1) · NEW, the level 2 default (a stand-in until the Talents pack)
**Flavor:** Every swing carries the whole weight of the steel.

When a [Melee, Strike, Weapon] Action you make with a two-handed weapon deals damage, it deals 1 more.

*Price:* +2.4 DE a turn (10%): the charter's growth step. Generic (any class with a two-handed melee weapon), so it is a Talent.

### Consecrated Ground (Paladin Daily) · the book's card, unchanged; the level 3 default
*Price:* 2 AP 21.7 (2.33, on target); 3 AP 45.2 (3.24, a little over). In the sim it is kept for the hard fight of the day.

### Radiant Zeal (Paladin Escalation, Passive) · NEW, the level 3 default
**Flavor:** The longer the fight, the brighter you burn.

While your Escalation is 1 or more, the first [Strike] Action you make each round that deals damage deals an extra [M] 1d6 Ho.

*Price:* 2.5 DE a turn while on (9% weighted): the level 3 growth step (the template has no Talent at level 3). At level 3 Momentum starts you at 2, so spending Divine Surge keeps it on, but turns Hallowed Stance off.

### Options (APPROVED by Lucas 2026-10-29 for the Options step; not in the main build)
- **Shield of Faith** (Turn, 1R): *Divine • Focus*; **Trigger:** a Strike damages you or an ally within 5 squares; reduce that damage by 1d6 + [Mod]. *Price:* 5.2 (1.12, on target; was 0.19). *Flavor (book):* A shimmer of light holds steady between them and harm.
- **Aura of Protection** (Encounter, 1 AP): *Area • Divine*; until the end of the encounter, you and allies in your Aura 2 gain +1 Defense (the Aura moves with you). *Price:* 6.5 (1.39, a little under; was 0.46). Defense bonuses don't stack, so it does nothing on top of Smite's +1. *Flavor (book):* You plant your feet, and light rims the shoulders of everyone near you.
- **Champion's Challenge**: not repriced. Its value is pulling attacks onto the tank, and the price list can't see that until NPC targeting is modeled (pack E2).

## 3. The budget table

Shares of the baseline PC (the Bestiary's 23.3 damage a turn at level 1; at levels 2 and 3 against the charter's curve, +10% a level: 25.6 / 28.0;
Health against the pre-P1 baseline Pool 31.5 / 34.0 / 36.5). **Sustained** = the damage a turn in the simulated Standard day on the turns
without an Encounter or Daily Action. **All turns** includes the Nova turns. Support = the DE a Paladin turn of its Defense, new Health, Font of
Mercy and Lay On Hands healing (1 Health = 1.1 DE), Divine Surge apart.

| Build | Sustained (85-90%) | Nova (150-180%) | All turns | Health (120-130%) | Support a turn | Divine Surge a turn | Standard day cleared |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Today's Paladin, L1** | 25.3 (109%) | 24.3 (104%) | 27.2 (117%) | 36 (114%) | 2.5 (11%) | - | 71% |
| **P1 Smite, L1** | 19.9 (85%) | 38.8 (166%) | 26.9 (116%) | 39 (124%) | 4.3 (18%) | 1.6 (7%) | 83% |
| P1 Smite holding Escalation, L1 | 20.0 (86%) | 38.8 (166%) | 26.7 (115%) | 39 (124%) | 4.3 + 1.0 reduced (23%) | 0.5 | 93% |
| **P1 Lay On Hands, L1** | 20.0 (86%) | 36.5 (157%) | 26.3 (113%) | 39 (124%) | 6.4 (27%) | 1.7 (7%) | 95% |
| P1 Smite with Guard (question 4.2), L1 | 19.7 (85%) | 38.8 (166%) | 26.7 (115%) | 39 (124%) | Guard 14.5 a day instead of 27 healed | 1.6 | 84% |
| P1 Smite, L2 | 22.1 (86%) | 40.8 (159%) | 28.8 (112%) | 43 (126%) | | | 68% |
| P1 Lay On Hands, L2 | 22.0 (86%) | 37.5 (146%) | 27.6 (108%) | 43 (126%) | | | 86% |
| P1 Smite, L3 | 24.3 (87%) | 44.3 (158%) | 30.8 (110%) | 46 (126%) | | | 94% |
| P1 Lay On Hands, L3 | 23.0 (82%) | 41.2 (147%) | 28.0 (100%) | 46 (126%) | | | 99% |
| Archer L1 (today, for reference) | 28.8 (124%) | 19.2 (82%) | 25.2 (108%) | 27 (86%) | - | - | |

- **Growth:** sustained 19.9 → 22.0 → 24.3 (Smite: +10%, +10%), 20.2 → 22.0 → 23.0 (Lay On Hands: +9%, +5%; Radiant Zeal is worth less to it).
- Against the Bestiary as it is (its level 2 and 3 baseline is 26.6, +14% at level 2, nothing at level 3) the level 2 builds read 83%, and
  level 2 is still the hard level (the day cleared 65% Smite / 84% Lay On Hands): pack E3's job.
- **Lay On Hands' Nova at levels 2 and 3:** 146-147% with Holy Wrath 3's Tier 3 at 7d8 (Lucas's fix; it was 142%): within the ruler's 3% tolerance of the band.
- Party fights (Smite + Lay On Hands + 2 Archers, CV 4): 3 rounds, 13 to 22% of the party's Health lost (today's: 28 to 37%; the book's target is about 40%). The party is now clearly stronger than the Bestiary: pack E3.

## 4. What changed from today's Paladin
- **Stat box:** Mind Health Multiplier ×3 → ×4 (Health 36 → 39 at level 1; Rally Points heal 10, were 9).
- **Level list:** level 1 now has a Talent, and one Signature (Smite *or* Lay On Hands, not both); level 2 is a Talent (was any Pick + a Passive Escalation); level 3 is a Daily + a Passive Escalation (was any Pick + a Daily + a Passive).
- **Features:** Divine Power gives the Signature choice and carries Profane Judgment (no longer its own Feature); **Font of Mercy** is new.
- **Smite:** 2 and 3 AP deal 1d6 / 1d10 / 2d8 Holy (were 2d4 / 2d6 / 2d8); the Boon on your next Divine Action and Smite 3's Appeal Save are gone; 2 AP gives +1 Defense, 3 AP also heals 1d8.
- **Lay On Hands:** 2 AP adds +2d8 to your next Strike (was: up to 2 Rally Points and Evade 2); a new 3 AP (up to 2 Rally Points and the rider).
- **Divine Surge:** the extra 1d8 goes to an ally's next hit on the target (was: your next Smite). The Paladin's own damage no longer gets 0 AP dice every round: that was most of its excess (117% → 86%).
- **New:** Holy Wrath (the Nova), Radiant Zeal, Heavy Blows (a stand-in Talent). **Defaults kept from the book:** Hallowed Stance, Opportunity Attack, Consecrated Ground.
- Not touched (they become options): Word of Radiance, Divine Retribution, Rebuke, Vow of Enmity, Sacred Weapon, Champion's Challenge, Miraculous Recovery, Divine Intervention, Call to Arms, Hand of Mercy, Judgment, Sanctified Ground, Aegis, Mercy's Reward, Avenger's Oath, Divine Vigil (Shield of Faith and Aura of Protection have proposed reprices above).

## 5. Assumptions I made
1. **"Sustained" is measured on the turns without an Encounter or Daily Action** (the real day, Momentum on), not on all turns. With fights of about 3 rounds a once-a-fight Nova is a third of the turns: if the 85-90% were meant over all turns, a 150%+ Nova would force the other turns down to about 52%, and Smite couldn't be a damage card. *(Question 1.)*
2. The Nova is aimed at the low end (151-161%) so that over a fight the Paladin doesn't out-damage the Archer by much.
3. Support target: about 20-25% of a turn (not in the charter): Defense, new Health, Font of Mercy and Lay On Hands; Divine Surge counted apart (it is the Escalation, as the Archer's Escalation is damage).
4. The Health baseline is frozen at the pre-P1 Paladin and Archer (31.5 at level 1): the charter's "average of the classes" moves with the Paladin itself.
5. Health comes from the stat box (Mind ×4), not a Feature. Profane Judgment is folded into Divine Power so the class keeps exactly two Features.
6. The level 1 Talent is Opportunity Attack (a Reaction: not in the numbers); the level 2 Talent is a new stand-in, Heavy Blows (+10%); the level 3 growth comes from the Passive Escalation (Radiant Zeal), since the template has no Talent at level 3.
7. The Encounter default is a new single-target card (Holy Wrath) rather than Word of Radiance (whose Nova on one creature is only 9).
8. The level 3 Daily default is the book's Consecrated Ground (support), not a damage Daily: the Nova already grows with Radiant Zeal.
9. Smite 1 stays as the book has it ("over" at 1.60).
10. Smite's heal and Lay On Hands' rider work whatever the Tier (on the Effects row), as the light does today.
11. The ruler: Divine Surge's extra damage is credited to the Paladin, not to the ally's damage; Hallowed Stance covers the one ally most often in front; Lay On Hands heals only an ally missing at least 3/4 of a Rally Point; a Daily is kept for a hard fight (CV 1.25+ per PC) or the last fight; the level 3 Archer is a stand-in (the level 2 Archer at level 3) until A1.

## 6. Lucas's answers (2026-10-29) and what is still open
**Decided and applied here (ruler and this document):** (1) sustained is measured on the turns without the Nova; (2) Font of Mercy +2;
(3) Holy Wrath 3's Tier 3 is 7d8; Smite has the **Signature** trait; Lay On Hands targets **one willing creature**; Divine Surge says "an ally"
(the rules already say you aren't your own ally); the Shield of Faith and Aura of Protection reprices are approved for the Options step.

**Open (my recommendation first):**

1. **Smite 3's heal out of combat.** Smite needs a creature to Strike, but nothing stops a Paladin from smiting a rat (or a bound prisoner) for a
   free 1d8 heal, and "no Actions out of combat" would feel like a cheat. **Recommendation: a temporary Health buffer that ends with the encounter.**
   Proposed name **Guard** (a system term, like Empowered; "Temporary Body/Mind Threshold" is long, and Ward is taken by Ward Defense):
   > **Guard N.** When you take damage, your Guard takes it first (Body or Mind damage alike), and only the rest reaches your Health. Guard isn't Health:
   > it can't be healed, it doesn't stack (keep the higher value), and it ends at the end of the encounter.

   Smite 3 then reads: "As 2 AP, and you or one ally in the light gain **Guard 1d8 + [Mod]**." Out of combat it does nothing (it ends with the encounter),
   so no rule against using Actions is needed. **Numbers:** a buffer only counts when a later hit uses it (fights are short), so it is worth about a
   third of a heal of the same size; at 1d8 + [Mod] the Standard day is the same as with the 1d8 heal (cleared 84% against 83%, Downs 1.3 a day, Guard
   absorbs 14.5 a day where the heal gave 27; Smite 3 prices at 1.02 against 1.22). Two points to settle with it: absorbed damage still counts as
   "taking damage" for triggers (my default), and it doesn't count for Bloodied. Other uses later: Talents, items, Hallowed Stance-like features.
   *Alternative (cheaper, weaker fix):* "you or an ally heal 1d8 when Smite damages an enemy" (a rat is still an enemy, so I don't recommend it).
2. **Holy Wrath: Weapon or Power.** **Recommendation: keep it a Weapon Action now and make the Power list in the Options step.** Reasons: the main
   build's riders all read Strikes (Lay On Hands' "+2d8 on your next Strike", Heavy Blows, Radiant Zeal), so a Power Holy Wrath (not a Strike) would
   lose the Lay On Hands Nova (36.5 → about 28, 120%: the rider would have no Strike to land on) unless those riders are rewritten; and the Lay On Hands Paladin still deals its damage with
   Weapon Attacks (a Power build needs a Power at-will, which the class doesn't have yet). For the Options step: a Power Holy Wrath (5 sq., Vs WD,
   [Mod] + more dice for the 1[W] it loses), with the riders written for [Divine] Actions, gives Lay On Hands its Power line (Smite → Weapon,
   Lay On Hands → Power, as you see it).
3. **Approve the cards** with those two choices, and they go into `book/rules-src` (the Paladin document's level list and cards) in the next step.
