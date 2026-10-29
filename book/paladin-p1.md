# The Paladin main build (pack P1, 2026-10-29): APPROVED, in the book

> **Applied 2026-10-29** to book/rules-src (12-paladin.md, 16-talents.md and the Core Rules: Guard, Willing and Unwilling, [Weapon] Actions by trait). Lucas's round 3: an Unconscious creature counts as willing (a new Willing and Unwilling section); Guard's absorbed damage isn't damage you take; effects on Actions name the trait ("1 Boon on [Weapon] Actions") and Chapter 5's "adds your Weapon Modifier" sentence is gone; Opportunity Attack stays the level 1 Talent. This file keeps the prices, the budget table and the reasons.
>
> **Round 5 (Lucas 2026-10-29), applied:** headings "Features", "Signature Class Action Selection" ("Choose one of the following Signature Actions:") and "Picks"; Divine Power keeps only the Profane line; **Font of Mercy is a Passive Escalation** (Escalation 1, an option, no longer a Feature: the Paladin has one Feature now); **Aura of Protection is an Active Escalation** (1 Escalation, 0 AP, Encounter: +1 Defense in your Aura 2 until the end of the encounter); **Bulwark of Faith** (new Encounter Reaction, 1 / 2R: an ally about to be hit gains Guard equal to one of their Rally Points; 2R also Shoves the attacker) takes Aura of Protection's place; Shield of Faith's Interrupt names a [Strike] Action; Consecrated Ground's Bane is on [Weapon], [Power] and [Signature] Actions; the card builder writes "**Area:**" in bold; Chapter 4 defines an **instance of damage**. Section 3's support numbers include Font of Mercy as a Feature (before round 5): without it, the default build's support is lower (prices.md and report.md have the current numbers).

Written to `book/class-charter.md`. Nothing here is in `book/rules-src` yet: you approve (or change) the cards first, then they go into the book,
then Foundry. The ruler files are `book/ruler/classes/paladin-smite-*.txt` and `paladin-hands-*.txt` (levels 1 to 3; `paladin-smite-1-hold`
is the same build holding its Escalation), the cards are priced in `book/ruler/catalogue/paladin-p1.txt`, and the numbers come from
`node book/ruler/econ.mjs` (prices.md) and `node book/ruler/spec.mjs` (report.md). `classes/paladin-book-1.txt` is today's Paladin, kept to compare.

## 1. The level list

| Level | What you gain (default in brackets) |
|---|---|
| **1** | 1 Feature (Divine Power) · 1 Signature Class Action: **Smite or Lay On Hands** · 1 Talent (Opportunity Attack) · **1 Encounter Pick (Holy Wrath)** · 1 Passive Escalation (Hallowed Stance) · 1 Active Escalation (Divine Surge) |
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
| **Effects** | The target sheds Bright light in a 1 Emanation and takes 1 Bane when they try to hide, for 1 round. | As 1 AP, but a 2 Emanation. You or one ally in the light gain +1 Defense for 1 round. | As 2 AP, and you or one ally in the light gain [[Guard]] 1d8 + [Mod]. |

*Price:* 1 AP 7.4 (1.60, **over**: unchanged from the book; a Round Strike skips the At-will Bane, and Smite 1 + two attacks is still the weakest full turn) · 2 AP 11.9 (1.27, on target) · 3 AP 13.4 (0.96, a little under: 11.2 damage + 0.6 Defense + 1.6 Guard). The Effects row works on Tier 2 or 3 only (the book, Effect Timing), so the riders land 72% of the time.
The support rider is the "small rider from the other side" (charter section 2): Defense and Guard for whoever is near the target.

### Lay On Hands (Divine Power 1) · 1 / 2 / 3 AP · Signature, changed
**Flavor:** Your touch carries your god's mercy.

*Divine • Focus* · **Frequency:** Round · **Target:** One willing creature · **Distance:** Reach

| 1 AP | 2 AP | 3 AP |
|---|---|---|
| The target can use 1 Rally Point. | As 1 AP, and your next [Strike] Action deals an extra [M] 0/2d8/2d8 Ho. | As 2 AP, but the target can use up to 2 Rally Points. |

*Price:* 1 AP 8.8 (1.89) · 2 AP 15.3 (1.64) · 3 AP 24.1 (1.72): **over** on the price list, which counts every use as a full Rally Point; but the Rally Point is the ally's own, and in the day it heals only when someone is hurt (the sim: at least 3/4 of a Rally Point missing). The rider is written per Tier (0 on Tier 1): a single "+2d8" would land on Tier 1 too (the book, Buffs) and push the build to 98% sustained. In the Standard day the 2 AP is used every turn (the rider works on any target) and heals 48.7 Health a day, about 4.3 a turn; per turn it is on budget (section 3).

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
| For 1 round, the next time an ally deals damage to the target, they deal an extra [M] 1d8 Ho. |

*Price:* 4.0 a use (17% of a turn, on target for 0 AP; 90% that an ally hits it in time); about 2.9 uses a fight with Momentum. In the day: 18 to 20 extra damage a day for the party (not counted in the Paladin's own damage).

### Hallowed Stance (Paladin Escalation, Passive) · the book's card, unchanged; the level 1 default
While your Escalation is 2 or more, if you haven't left your square since your last turn, you and your adjacent allies take less Body damage, reduced by your Power Modifier (minimum 0). (One instance per Action.)

*Price:* 7.2 DE a turn while on (17% of a turn weighted by how often it is on).

**Spend now or hold (charter section 6):** Divine Surge costs 1, Hallowed Stance needs 2. Spending every round gives about 18.5 extra party damage a day and Hallowed Stance never turns on; holding (spending only above 2: `paladin-smite-1-hold`) gives 6.2 extra damage and 10.6 damage reduced. In DE the two are even (18.5 against 6.2 + 11.7), so the choice is real; holding is better for the tank's survival (Downs a day 0.82 against 1.30, the day cleared 93% against 83%), spending is better when the fight is short.

### Opportunity Attack (Talent 1) · the book's Talent; the level 1 default
A Reaction (not modeled by the ruler, so not in the numbers).

### Heavy Blows (Talent 1) · NEW, the level 2 default (a stand-in until the Talents pack)
**Flavor:** Every swing carries the whole weight of the steel.

When a [Melee, Strike, Weapon] Action you make with a Two-handed weapon deals damage, it deals 1 more.

*Price:* +2.4 DE a turn (10%): the charter's growth step. Generic (any class with a two-handed melee weapon), so it is a Talent.

### Consecrated Ground (Paladin Daily) · the book's card, unchanged; the level 3 default
*Price:* 2 AP 21.7 (2.33, on target); 3 AP 45.2 (3.24, a little over). In the sim it is kept for the hard fight of the day.

### Radiant Zeal (Paladin Escalation, Passive) · NEW, the level 3 default
**Flavor:** The longer the fight, the brighter you burn.

While your Escalation is 1 or more, the first [Strike] Action you make each round that deals damage deals an extra [M] 1d6 Ho.

*Price:* 2.5 DE a turn while on (9% weighted): the level 3 growth step (the template has no Talent at level 3). At level 3 Momentum starts you at 2, so spending Divine Surge keeps it on, but turns Hallowed Stance off.

### Options (APPROVED by Lucas 2026-10-29 for the Options step; not in the main build)
- **Shield of Faith** (Turn, 1R): *Divine • Focus*; **Interrupt:** a Strike would damage you or an ally within 5 squares; reduce that damage by 1d6 + [Mod] (an Interrupt, because it changes damage that hasn't been dealt yet; a Trigger comes after the damage). *Price:* 5.2 (1.12, on target; was 0.19). *Flavor (book):* A shimmer of light holds steady between them and harm.
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
| **P1 Smite, L1** | 20.0 (86%) | 38.8 (166%) | 26.8 (115%) | 39 (124%) | 2.9 (12%) | 1.6 (7%) | 82% |
| P1 Smite holding Escalation, L1 | 19.8 (85%) | 38.8 (166%) | 26.4 (113%) | 39 (124%) | 2.8 + 1.0 reduced (16%) | 0.5 | 90% |
| **P1 Lay On Hands, L1** | 20.0 (86%) | 36.5 (157%) | 26.3 (113%) | 39 (124%) | 6.3 (27%) | 1.7 (7%) | 94% |
| P1 Smite, L2 | 21.7 (85%) | 40.8 (159%) | 28.4 (111%) | 43 (126%) | | | 64% |
| P1 Lay On Hands, L2 | 22.0 (86%) | 37.5 (146%) | 27.6 (108%) | 43 (126%) | | | 86% |
| P1 Smite, L3 | 24.0 (86%) | 44.3 (158%) | 30.5 (109%) | 46 (126%) | | | 93% |
| P1 Lay On Hands, L3 | 23.0 (82%) | 41.2 (147%) | 28.0 (100%) | 46 (126%) | | | 99% |
| Archer L1 (today, for reference) | 28.8 (124%) | 19.2 (82%) | 25.2 (108%) | 27 (86%) | - | - | |

- **Growth:** sustained 20.0 → 21.7 → 24.0 (Smite: +9%, +11%), 20.0 → 22.0 → 23.0 (Lay On Hands: +10%, +5%; Radiant Zeal is worth less to it).
- **The Smite Paladin's support is now 12% of a turn** (Lay On Hands 27%): reading the Effects row as Tier 2+ and Guard (a buffer only counts when a hit follows) cost it about a third. Its day is still 82% cleared (today's Paladin: 71%); holding Escalation for Hallowed Stance makes it 90%.
- Against the Bestiary as it is (its level 2 and 3 baseline is 26.6, +14% at level 2, nothing at level 3) the level 2 builds read 83%, and
  level 2 is still the hard level (the day cleared 64% Smite / 86% Lay On Hands): pack E3's job.
- **Lay On Hands' Nova at levels 2 and 3:** 146-147% with Holy Wrath 3's Tier 3 at 7d8 (Lucas's fix; it was 142%): within the ruler's 3% tolerance of the band.
- Party fights (Smite + Lay On Hands + 2 Archers, CV 4): 3 rounds, 13 to 22% of the party's Health lost (today's: 28 to 37%; the book's target is about 40%). The party is now clearly stronger than the Bestiary: pack E3.

## 4. What changed from today's Paladin
- **Stat box:** Mind Health Multiplier ×3 → ×4 (Health 36 → 39 at level 1; Rally Points heal 10, were 9).
- **Level list:** level 1 now has a Talent, and one Signature (Smite *or* Lay On Hands, not both); level 2 is a Talent (was any Pick + a Passive Escalation); level 3 is a Daily + a Passive Escalation (was any Pick + a Daily + a Passive).
- **Features:** Divine Power gives the Signature choice and carries Profane Judgment (no longer its own Feature); **Font of Mercy** is new.
- **Smite:** the Signature trait; 2 and 3 AP deal 1d6 / 1d10 / 2d8 Holy (were 2d4 / 2d6 / 2d8); the Boon on your next Divine Action and Smite 3's Appeal Save are gone; 2 AP gives +1 Defense, 3 AP also Guard 1d8 + [Mod].
- **Lay On Hands:** one willing creature; 2 AP adds +0/2d8/2d8 to your next Strike (was: up to 2 Rally Points and Evade 2); a new 3 AP (up to 2 Rally Points and the rider).
- **Divine Surge:** the extra 1d8 goes to an ally's next hit on the target (was: your next Smite). The Paladin's own damage no longer gets 0 AP dice every round: that was most of its excess (117% → 86%).
- **New:** Holy Wrath (the Nova), Radiant Zeal, Heavy Blows (a stand-in Talent), and the system term **Guard**. **Defaults kept from the book:** Hallowed Stance, Opportunity Attack, Consecrated Ground.
- Not touched (they become options): Word of Radiance, Divine Retribution, Rebuke, Vow of Enmity, Sacred Weapon, Champion's Challenge, Miraculous Recovery, Divine Intervention, Call to Arms, Hand of Mercy, Judgment, Sanctified Ground, Aegis, Mercy's Reward, Avenger's Oath, Divine Vigil (Shield of Faith and Aura of Protection have proposed reprices above).

## 5. Assumptions I made
1. **"Sustained" is measured on the turns without an Encounter or Daily Action** (the real day, Momentum on), not on all turns (Lucas agreed). With fights of about 3 rounds a once-a-fight Nova is a third of the turns.
2. The Nova is aimed at the lower half of its band (157-166% at level 1) so that over a fight the Paladin doesn't out-damage the Archer by much.
3. Support target: about 20-25% of a turn (not in the charter): Defense, Guard, Font of Mercy and Lay On Hands; Divine Surge counted apart (it is the Escalation, as the Archer's Escalation is damage). The Smite Paladin is now under it (12%): it is the damage Signature, so I left it; raising Smite 3 to the band (Guard on every Tier, or +2 Defense) is an option.
4. The Health baseline is frozen at the pre-P1 Paladin and Archer (31.5 at level 1): the charter's "average of the classes" moves with the Paladin itself.
5. Health comes from the stat box (Mind ×4), not a Feature. Profane Judgment is folded into Divine Power so the class keeps exactly two Features.
6. The level 1 Talent is Opportunity Attack (a Reaction: not in the numbers); the level 2 Talent is a new stand-in, Heavy Blows (+10%); the level 3 growth comes from the Passive Escalation (Radiant Zeal), since the template has no Talent at level 3.
7. The Encounter default is a new single-target card (Holy Wrath) rather than Word of Radiance (whose Nova on one creature is only 9).
8. The level 3 Daily default is the book's Consecrated Ground (support), not a damage Daily: the Nova already grows with Radiant Zeal.
9. Smite 1 stays as the book has it ("over" at 1.60).
10. ~~Smite's riders work whatever the Tier~~ **Corrected:** the Effects row works on Tier 2 or 3 only (the book, Effect Timing); the ruler now does the same.
11. The ruler: the Signature Modifier equals the Weapon Modifier in this build (+2), so the Signature trait changes no number here; Guard goes to the Paladin itself (the one most often hit); Divine Surge lasts until the Paladin's next turn (the card's "for 1 round" lasts to the end of it: a little more); Divine Surge's extra damage is credited to the Paladin, not to the ally's damage; Hallowed Stance covers the one ally most often in front; Lay On Hands heals only an ally missing at least 3/4 of a Rally Point; a Daily is kept for a hard fight (CV 1.25+ per PC) or the last fight; the level 3 Archer is a stand-in (the level 2 Archer at level 3) until A1.

## 6. Lucas's answers (2026-10-29)
**Round 1, applied:** sustained on the turns without the Nova; Font of Mercy +2; Holy Wrath 3 Tier 3 7d8; Smite has the Signature trait; Lay On
Hands targets one willing creature; Divine Surge says "an ally"; the Shield of Faith and Aura of Protection reprices approved for the Options step.

**Round 2, applied:** **Guard** replaces Smite 3's heal (rule below); Holy Wrath stays a Weapon Action, a Power version comes in the Options step;
Holy Wrath has no Signature trait (Lucas: Signature is for Daily and class-specific Actions).

> **Guard N** (proposed text for Chapter 4, Health, after Heal, and the glossary). When you take damage, your Guard takes it first (Body or Mind
> damage alike), and only the rest reaches your Health. Guard isn't Health: it can't be healed, it doesn't stack (keep the higher value), and it
> ends at the end of the encounter.

## 7. System check (Lucas: "reread it all and see if it is all following the system")

I reread every card against the core rules (Chapters 1, 2, 4, 5, 7, 8 and the glossary). **Corrected in this document and the ruler** (revert any):

1. **The Effects row happens on Tier 2 or 3 only** (Effect Timing). Smite's light, +1 Defense and Guard are on that row, so they need a Tier 2;
   I had priced them on every Tier. With the rule: Smite 2 1.27, Smite 3 0.96 (a little under), the Smite Paladin's support 12% of a turn (was 18%).
   If you want the riders on every Tier, they go in the Tier rows (Tier 1 too), as "Tier 1: ...; +1 Defense" does.
2. **A single-value Buff applies on Tier 1 too** (Buffs). Lay On Hands' "+[M] 2d8" would then land even when the Strike's own Tier 1 deals nothing,
   and the build would be at 98% sustained. Written per Tier, **+[M] 0/2d8/2d8**, it keeps the value I measured (86%). "This turn" is dropped:
   "your next Action" already has to happen this turn (Your Next Action).
3. **Divine Surge's duration**: "before the start of your next turn" isn't one of the book's durations; **"For 1 round"** is (it ends at the end of
   your next turn, a little longer).
4. **Shield of Faith (option) must be an Interrupt**: reducing damage has to happen before it is dealt (Reactions: a Trigger happens after).
5. **Heavy Blows**: "a Two-handed weapon" (the property's name in the Gear document).

**Still to decide (my recommendation first):**

6. **Lay On Hands on a Down ally.** "One willing creature": an Unconscious ally can't be willing, and bringing a Down ally back is Lay On Hands'
   main job (Chapter 4: "Other Actions can still let you use Rally Points, such as Lay On Hands"). The book has no definition of "willing".
   **Recommendation:** "**Target:** One willing or Unconscious creature", or a glossary entry: "**Willing:** a creature that doesn't refuse the
   effect; an Unconscious creature is willing."
7. **Guard and "taking damage".** My first default was that damage Guard takes still counts as taking damage. Reading Chapter 4 changed my mind:
   a Dying creature that keeps fighting checks every time it takes damage, and a hit fully absorbed by Guard shouldn't make it roll.
   **Recommendation:** "Damage your Guard takes isn't damage you take." (Divine Retribution wouldn't trigger on it; that's the price of a clean rule.)
   Order: damage reduction (Hallowed Stance) first, then Guard. Add Guard to the Stacking list (Empowered, Enfeebled, Vulnerable, a Defense, Guard).
8. **Signature and the Weapon Modifier.** Chapter 5 says "A Weapon Action adds your Weapon Modifier to its damage on Tier 2 or 3", while Chapter 1
   says [Mod] is the Modifier used to roll. Smite is now a Weapon Action that rolls the Signature Modifier, so the two disagree for it.
   **Recommendation:** Chapter 5's sentence becomes "A Weapon Action adds its [Mod] (the Modifier it rolls) to its damage on Tier 2 or 3".
   Also: with the Signature trait, Smite isn't a Weapon roll, so "1 Boon on Weapon rolls" effects don't help it (trait effects, such as Bloodied's
   Bane on [Strike] and [Weapon] Actions, Bloodlust and Heavy Blows, still do). That is how the rules read; just confirming it is what you want.
9. **Opportunity Attack needs unspent AP**, and the main turn (Smite 3 + two attacks) spends all 5. The level 1 Talent works when you take the
   4 AP turn (Smite 2 + two attacks: +1 Defense instead of Guard) and keep 1 AP. Fine for a tank, I think; say if you'd rather default to a
   non-Reaction Talent.
10. **Book text that changes with the cards** (when they go into rules-src): the Linked Actions and Targets of Effects examples (Chapter 2) use Lay On
   Hands' Evade 2, which P1 removes; the Stacking example uses the old Divine Surge; Chapter 4's Health example uses the Paladin's Mind ×3; Chapter 5
   says Class Actions are what "every character of that class has", which the Signature choice changes (it needs a sentence on the Signature and the
   level 1 Talent in step 7); Chapter 7's Tags line names Profane Judgment as its own Feature. Foundry (later): Lay On Hands, Smite, Divine Surge and the
   level list in the compendium, and Guard as a tracked value.

Everything else follows the system: AP and Strikes per turn (5 and 3 at most in every planned turn), Frequencies (Round, Encounter, Daily; Divine
Surge as a 0 AP Escalation Action used on your turn), Escalation spent and the passives that need it, damage written with its pool ([B] / [M], Ho),
"[Strike] Action" for the trait, the light and the Aura shapes, Heal and Rally Points (Font of Mercy adds Health to a Rally Point's), Stacking
(Smite's +1 Defense and Aura of Protection don't add up; Guard keeps the higher).

**Next:** you approve the corrections (1-5) and answer 6-9, then the cards and Guard go into `book/rules-src`.

## 8. Round 6 (Lucas 2026-10-29): Font of Mercy a Feature again, and how the Paladin holds up

**Applied:** Font of Mercy is a Feature that is an Escalation Passive (every Paladin has it; it doesn't use the Passive Escalation Pick):
"While your Escalation is 1 or more, when you or an ally within 5 squares of you uses a Rally Point, they heal your Power Modifier + 2 more."
Bulwark of Faith 2R: "the triggering creature is Slid 2" (was a Shove). The ruler had a bug that let Font of Mercy work between fights; fixed
(an Escalation Passive needs the Escalation, which is 0 between fights).

**The numbers** (`node book/ruler/spec.mjs`, `node book/ruler/econ.mjs`, 2026-10-29):

| Build | Sustained (85-90%) | Nova (150-180%) | All turns | Health (120-130%) |
|---|---:|---:|---:|---:|
| Smite L1 / L2 / L3 | 85% / 86% / 88% | 166% / 159% / 158% | 115% / 112% / 110% | 124% / 126% / 126% |
| Lay On Hands L1 / L2 / L3 | 86% / 86% / 82% | 157% / **146%** / **147%** | 112% / 108% / 101% | 124% / 126% / 126% |

(Levels 2 and 3 against the charter's +10% curve.)

| Day cleared (Downs a day) | Standard day | Long day | Short hard day |
|---|---:|---:|---:|
| Today's Paladin before P1, L1 | 71% (1.84) | 37% (3.46) | 65% (2.23) |
| Smite, spending Divine Surge, L1 | 84% (1.36) | 85% (1.60) | 82% (1.63) |
| Smite, holding for Hallowed Stance, L1 | 94% (0.88) | 96% (1.06) | 95% (0.97) |
| Lay On Hands, L1 | 94% (0.61) | 84% (1.29) | 93% (0.76) |
| Smite / Lay On Hands, L2 | 70% / 86% | 79% / 85% | 67% / 85% |
| Smite / Lay On Hands, L3 | 96% / 100% | 97% / 99% | 95% / 100% |

Duels (a Medium Standard, 57 Health): the Paladin kills it in about 2.4 rounds and it needs 8.5 to 10 rounds to put the Paladin Down; an Elite
takes 5.5 to 6 rounds and puts the Paladin Down in 3.4 to 4. Party fights (Smite + Lay On Hands + 2 Archers, CV 4): 3 rounds, 15 to 22% of the
party's Health lost (the book's target is about 40%), a PC Down in 0 to 6% of the fights.

**What it says:**
1. **The budgets hold at level 1**, for both Signatures. At levels 2 and 3 the Lay On Hands Nova is 146-147% (the band starts at 150%), and the
   Lay On Hands Paladin's sustained damage at level 3 is 82% (Radiant Zeal is worth less to it): small.
2. **The Paladin is much sturdier than before** (the Long day: 37% → 84-96%), and a P1 party is too strong for the Bestiary as it is (15-22% of
   its Health in a normal fight against a 40% target). That is pack E3 (the Bestiary refit to the new baseline), as planned.
3. **Holding Escalation beats spending it** for the Smite Paladin: the same value in damage-equivalents, but Hallowed Stance prevents Downs
   (0.88 against 1.36 a day). The choice is real but not even; a player who learns it will hold. Options: Divine Surge a bit stronger
   (1d10, or 1d8 + [Mod]), or leave it (holding is the tank's play).
4. **Level 2 is still the hard level** (Smite 70%): the Bestiary grows NPC Health 14% at level 2, the PCs +10% (E3).
5. **Over a whole fight the Paladin deals 110-115% of the baseline**, the Archer today 106%: the Nova is a third of the turns. A1 (the Archer
   rewrite) should take this into account, as section 6 said.
6. **Font of Mercy** is worth about 3% of a turn in a Smite party (few Rally Points are used in fights) and about 15% in a Lay On Hands party
   (it heals 13 a day there): it is the Lay On Hands Paladin's Feature in practice.
7. Cards off their band: Smite 1 over (1.60, the book's), Smite 3 a little under (0.96), Lay On Hands over on the price list (it counts the
   ally's own Rally Points), Bulwark of Faith 1R a little under (1.27) and 2R under until E2 prices Slid.
