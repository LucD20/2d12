# Weapon Trees (design, from 2026-10-31; nothing in rules-src yet)

Lucas's decisions so far (gear-d2.md section 10): **Group Mastery = the Mastery gained with all weapons of the group / 3** (rounded down); a
weapon you start using begins at your Group Mastery, and what you gain with it adds on top (its starting value doesn't count in the group
total). **Stage 1 Basic, Stage 2 Advanced, Stage 3 Exotic weapons.** Pace: about 5 combats a level, 0.9 Mastery a combat (the cap: 1 per
group per encounter), so **Group Mastery is about 6 at level 5 and 11 at level 8**, whatever bows you used.

## The rules every tree uses (draft)

| | Basic | Advanced | Exotic |
|---|---|---|---|
| Opens at | Group Mastery 0 | Group Mastery 6 (about level 5) | Group Mastery 11 (about level 8) |
| Below it | | 2 Banes on [Strike] Actions with it | 2 Banes |
| A Weapon Attack (DE, Modifier +2, Defense 13) | about 4.5 | about 5.0 (+10%) | about 5.4 (+20%) |
| Its own unlocks | many, from 3, going on into Stages 2 and 3 | fewer, from its starting Mastery (6) up | fewest, from 11 up |

- **Deeper is not stronger over a weapon's life:** the Basic weapon's later unlocks pay for its smaller dice. Staying on it is a real choice.
- **Master** (one more [W] from level 8) becomes "level 8 and Group Mastery 11": every bow of the group has it then.
- **Unlocks are mostly utility** (Lucas, answer 2): different for each weapon, from what the real weapon was good at.

## The Bow trees (proposal, round 2: two starting bows, two full trees)

### What the research says (summary; sources in the chat of 2026-10-31)
- **Self bows** are one piece of wood. Wood needs long limbs to bend without breaking, so a short self bow is a light bow, and a powerful self
  bow is a long one: the **longbow** is a tall self bow (English: yew, D-shaped section). A **flatbow** has flat, wide limbs (dense woods like
  hickory or osage orange, favored by many Native American peoples); it can be long or very short.
- **Composite bows** laminate horn (belly), wood (core) and sinew (back), usually in a **recurve** shape: short and still powerful, which is
  why they were the horse archers' bow (steppe peoples; the Plains peoples made short sinew-backed bows for horseback after the horse came).
  They take longer and more skill to make, and the glue makes them **sensitive to rain and damp**.
- **War longbows** (the Mary Rose, 1545): estimates from about 100 to 185 lb of draw; Robert Hardy's team put most at 150-160 lb, the Mary
  Rose Trust says most are lighter than the heavyweights. **Military arrows** were much heavier than hunting arrows (one estimate: about 50%).
- **Ottoman flight bows**: composite recurves built only for distance, with special light flight arrows; the record is about **845 m**
  (still unbeaten with similar equipment). Light hits: they were for sport and records, not for armor.
- Also seen, for later trees or branches: the Japanese **yumi** (over 2 m, asymmetric, held below the center; the samurai's main weapon until
  firearms, 1543).

### Two trees

**The line names (Yew, Horn) are design flavor only (Lucas): never in the book.** Every weapon group gets the same treatment: a short research, then its trees.

| | **The Yew line** (wood: range, weight, any weather) | **The Horn line** (composite: moving, speed, fragile) |
|---|---|---|
| **Basic** (Group Mastery 0) | **Hunting Bow:** a short wooden self bow or flatbow, light draw | **Horse Bow:** a short sinew-backed or composite bow, made to shoot from a moving horse |
| **Advanced** (Group Mastery 6) | **Longbow:** the tall yew self bow, heavy draw, volleys | **Composite Bow:** the full horn-wood-sinew recurve war bow of the steppe |
| **Exotic** (Group Mastery 11) | **Warbow:** the heaviest war longbow, heavy military arrows | **Flight Bow:** the Ottoman distance bow, light flight arrows |

| Weapon | Range | Damage (T2 / T3) | Weapon Attack | Its thing (first draft of the identity) |
|---|---|---|---:|---|
| Hunting Bow | 8 / 16 / 32 | 1d6 / 1d10 | 4.51 | Handy and quiet: close quarters, hunting (Hide, when it exists), quick to nock |
| Horse Bow | 6 / 12 / 24 | 1d4+1 / 1d8+1 | 4.51 | Shooting while moving: its unlocks are Evades and Advances around a Shot |
| Longbow | 15 / 30 / 60 | 1d8 / 1d10 | 4.96 (+10%) | Range and volleys: far range easier, Area Shots (Volley, Rain of Arrows) better |
| Composite Bow | 10 / 20 / 40 | 1d6 / 1d12 | 4.77 (+6%) and a utility | Power for its size: the Horse Bow's movement with real force (the damp drawback: out, Lucas) |
| Warbow | 12 / 24 / 48 | 1d8 / 2d6 | 5.36 (+19%) | The heavy arrow: Tier 3 effects that move or stagger (Pushed, Prone), against armor; slow to draw (it can't Evade in the same Action) |
| Flight Bow | 20 / 40 / 80 | 1d4 / 2d8 | 4.99 (+11%) | Extreme range and precision: no far range Bane, and its edge is the range itself, not the hit |

**Lucas's answers (round 2):** 1 yes (the line names are flavor only). 2 **History is the base and the flavor, game mechanics decide the
numbers**: maps are at most about 25 x 25 squares, so long historical ranges mean nothing in play. 3 No damp drawback (too specific); a
**Volley N** property ("a Shot with it against a creature within N squares takes 1 Bane") is possible where it fits. 4 Always from Basic up,
and **everything is confirmed before a bow is built**: the sheet below.

## To confirm before building (round 3)

**Already decided:** Group Mastery = Mastery gained in the group / 3; a new weapon starts at it; Stage 1 Basic, Stage 2 Advanced, Stage 3
Exotic; about 5 combats a level and 0.9 Mastery a combat; utility unlocks, different for each weapon; overlaps between weapons are fine.

| # | What | My proposal |
|---|---|---|
| 1 | The gates | Advanced at Group Mastery **6** (about level 5), Exotic at **11** (about level 8); **2 Banes** on [Strike] Actions with a weapon below its gate |
| 2 | Damage (working numbers, Lucas: decided later) | A Weapon Attack about **4.5** Basic, **+10%** Advanced, **+20%** Exotic (Defense 13, Modifier +2); a weapon with a drawback (Volley) or a strong utility sits a little higher or lower |
| 3 | The ladder (the weapon's own Mastery) | Basic: **3, 8, 14, 20, 28** (5 unlocks); Advanced, starting at 6: **9, 14, 20, 28** (4); Exotic, starting at 11: **14, 20, 28** (3). The first unlock of each weapon is its Weapon Technique |
| 4 | What an unlock can be | A Weapon Technique (one per weapon), a **utility** (movement, hands, Banes in special cases, Reactions, areas), or a step of the Technique; **never extra dice** (the dice come from the tier) |
| 5 | Master | Level 8 **and** Group Mastery 11: one more [W] with every weapon of the group |
| 6 | Ranges on a 25 x 25 map | **Normal range is what matters.** Basic bows normal 6 to 8, Advanced 10 to 12, Exotic up to 15; far = 2 x normal, maximum = 3 x (the book uses 2 x and 4 x today: 10 / 20 / 40). A bow whose normal range covers the map takes no range Bane in practice: that is the Flight Bow's edge, with Exotic dice |
| 7 | Volley N | A property for the heavy bows (the Longbow, the Warbow): 1 Bane on Shots within N squares. If a third of the Shots are that close, Volley 3 costs about 3% of the damage and pays for a little more dice. I measure it with the map model before giving it a number |
| 8 | The book | Nothing goes into rules-src until a whole group is confirmed; then its trees replace D2's weapon rows for that group (D2's Shortbow and Longbow) |

**The six bows after these answers:**

| Weapon | Gate | Range | Damage (T2 / T3) | Its thing |
|---|---|---|---|---|
| Hunting Bow | Basic | 8 / 16 / 24 | 1d6 / 1d10 | Handy and quiet, quick to nock, close quarters |
| Horse Bow | Basic | 6 / 12 / 18 | 1d4+1 / 1d8+1 | Shooting on the move |
| Longbow | Advanced | 12 / 24 / 36, Volley ? | about +10% | Range and volleys |
| Composite Bow | Advanced | 10 / 20 / 30 | about +6%, and a movement unlock | The Horse Bow's movement with more force |
| Warbow | Exotic | 12 / 24 / 36, Volley ? | about +20% | The heavy arrow: Tier 3 effects that move or stagger; slow |
| Flight Bow | Exotic | 15 / 30 / 45 | about +20% (history says light hits; the game gives it the dice) | Range that covers the map: no range Banes in practice; light, fast arrows (Reactions, quick Shots) |

Once 1 to 8 are confirmed (or changed): the Hunting Bow in full (stats, Technique, the whole ladder), then the Horse Bow.

**Lucas (round 3): yes to all 8.** Building starts, from Basic up, one bow at a time; each is confirmed before the next.

## Bow 1: the Hunting Bow (Basic), to confirm

**The real weapon:** a short wooden self bow or flatbow with a light draw: the bow of hunters, quick to nock and shoot, easy to carry
through brush and to use in tight places. Its arrows wound more than they kill outright: the hunter follows the wounded prey.

| Group | Gate | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---|---:|
| Bows | Basic (Group Mastery 0) | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [B] 0 / 1d6 / 1d10 | 4.51 DE |

| Mastery | About (0.9 a combat) | Unlock | Kind | Worth (prices.md) |
|---:|---|---|---|---|
| 3 | combat 4 (session 2 to 3) | **Wounding Shot** (Weapon Technique, card below) | Technique | 5.5 DE, efficiency 1.17 (on target) |
| 8 | combat 9 (level 2) | **Quick Nock:** once each turn, you draw or stow the Hunting Bow without the Interact Action. | utility | 1 AP on a turn you switch weapons |
| 14 | combat 16 (level 4) | **Close Quarters:** while you are Engaged, [Ranged] Actions with it take 1 Bane for it instead of 2. | utility | +0.44 DE a Shot while Engaged (3.61 → 4.05) |
| 20 | combat 22 (level 5) | **Blood Trail:** Wounding Shot's Hindered also happens on a Tier 2. | Technique step | 6.1 DE, efficiency 1.31 (a little over the Round band: fine for a Stage 2 unlock) |
| 28 | combat 31 (level 7) | **Steady Hands:** once each round, a Shot with it ignores 1 Bane (from any source). | utility | about +3% of a turn (it keeps the Hunting Bow worth holding against the Exotic bows' +20%) |

<div class="action" markdown="1">
<div class="action-head"><span>Wounding Shot</span><span>1 AP</span><span class="cat">Weapon Technique</span></div>

**Flavor:** Not the kill: the wound that slows them down, and you follow.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

| | 1 AP |
|---|---|
| **Tier 1** | [B] [Mod] Pi |
| **Tier 2** | [B] 1d6 + [Mod] Pi |
| **Tier 3** | [B] 1d10 + [Mod] Pi; Hindered (EoT). |

</div>

**Against an Advanced bow at level 5** (+10% on every Weapon Attack, its own unlocks from 9): the Hunting Bow has its Technique, Quick Nock,
Close Quarters and, at about the same time, Blood Trail: about even in damage (Technique +5% of a turn, Close Quarters +2%, Blood Trail +2%),
better in close and changing fights. **Against an Exotic bow at level 8** (+20%): Steady Hands closes part of the gap; Master (one more [W])
is the same for both.

**Left for later:** a "quiet" unlock (the Hunting Bow makes no noise: Hearing) when the Hide rules exist; it could replace Quick Nock.

**To confirm:** the stats, the five unlocks and their steps, and the card. Then: the Horse Bow.

**Lucas (Hunting Bow, round 1):** swap the order: **Close Quarters at 3, Wounding Shot at 8, Quick Nock at 14**. Wounding Shot can use a
coming mechanic, **Bleed** (persistent damage): now or later? My proposal (to confirm), as a rule for every weapon group:

> **Bleed N:** at the end of each of its turns, the creature takes N damage of the pool that caused it. Bleed ends when the creature is
> healed, when a creature staunches it with Interact (1 AP; the bleeding creature can), or when the encounter ends. Bleed again: keep the
> higher value.

Wounding Shot with it: Tier 3 [B] 1d10 + [Mod] Pi; **Bleed 1** (instead of Hindered); Blood Trail (20): Bleed on a Tier 2 too. Worth: about
+0.5 DE a use if the bleeding lasts 2 of its turns (efficiency about 1.2); the ruler learns `bleed N` before the number is final.
**Note:** "the first unlock is the Technique" (rule 3) becomes "the Technique is one of the first two unlocks", and the Archer's Sharpshooter
(3 Mastery with one Projectile weapon, to unlock its Technique at level 1) would give Close Quarters instead: keep it, or 8?

**Lucas (Bleed, round 2):** removing Bleed is an **Interact Action that allows a Save**, with the Attributes in its notation:
**Bleed 5 (Mi/Ap)** = Mind or Appeal, **DC 13** unless written ("Bleed 5 (Mi/Ap; DC 15)"). Three ideas for the tiers: (A) no effect / halve
the next Bleed damage / removed; (B) take half the Bleed damage / no effect / removed; (C) no effect / 1 Boon on the next attempt / removed.
**The numbers** (2d12 + Attribute against DC 13; Tier 3 is 19% / 23% / 27% at +0 / +1 / +2): when only a Tier 3 removes it, removing Bleed
takes **3.4 to 5.3 Interacts** on average (A and B 3.7 to 5.3, C 3.4 to 4.9); fights last about 3.5 rounds, so Bleed would almost never be
removed and the Save would rarely matter. **My proposal (D):** no effect / **you take half the Bleed damage at the end of this turn, then it
ends** / **it ends now**: removed in 1.4 to 1.7 Interacts on average, so staunching is a real choice (about one Strike's worth of AP).
Questions: the pool of the damage (the pool of its Attributes: Bo/In Body, Mi/Ap Mind?), the better of the two Attributes, and can an ally
staunch you (with your Save, or its own: Skills, D3)?

**Lucas (Bleed, round 3): yes to all (D, the pool from the Attributes, the better of the two, allies can staunch), and:** the pool can be
written ([B] or [M]) when it isn't the Attributes' own: "Bleed 1 ([B] Ap)" is Body damage with an Appeal Save; and **Bleed can be dice**
("Bleed 2d6", "Bleed 1d4+2"), flat numbers still allowed.

## Bleed (the rule, decided; for the book with the first group that uses it: Conditions)

> **Bleed X (Attributes):** at the end of each of its turns, the creature takes X damage (a number or dice, rolled each time). The damage is
> Body for **Bo/In** and Mind for **Mi/Ap**, unless the Bleed writes its pool: **Bleed 1 ([B] Ap)**. A creature can end it with **Interact
> (1 AP)**, on itself or on a creature within its Reach: the bleeding creature makes a Save with the better of the two Attributes against
> **DC 13**, or the DC written (**Bleed 1d6 (Bo/In; DC 15)**). **Tier 1:** no effect. **Tier 2:** it takes half the Bleed at the end of this
> turn, then the Bleed ends. **Tier 3:** the Bleed ends. Bleed ends when the encounter ends; healing doesn't end it. A creature
> that gets Bleed again keeps the one with the higher average.

**The numbers:** staunched every turn, a Bleed deals 0.7 to 1.05 of its value (Save +2 to +0; 1.05 to 1.55 at DC 15) and costs the
bleeding side 1 AP or more a turn; left alone, it deals its value each turn until the fight ends (about 2 more turns).
**Decided (Lucas):** the bleeding creature always makes the Save, even when another creature staunches it; healing doesn't end Bleed.

## Bow 1: the Hunting Bow (Basic), round 2 (to confirm)

| Group | Gate | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---|---:|
| Bows | Basic (Group Mastery 0) | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [B] 0 / 1d6 / 1d10 | 4.51 DE |

| Mastery | About | Unlock |
|---:|---|---|
| 3 | session 2 to 3 | **Close Quarters:** while you are Engaged, [Ranged] Actions with it take 1 Bane for it instead of 2. |
| 8 | level 2 | **Wounding Shot** (Weapon Technique, below). |
| 14 | level 4 | **Quick Nock:** once each turn, you draw or stow it without the Interact Action. |
| 20 | level 5 | **Blood Trail:** the Bleed of your Wounding Shot has DC 15, and a creature bleeding from it is never Unsensed by you. |
| 28 | level 7 | **Steady Hands:** once each round, a Shot with it ignores 1 Bane (from any source). |

**Wounding Shot** (1 AP, Weapon Technique; *Ranged • Shot • Strike • Weapon*; Round; One creature; Distance: Weapon; Vs: AD)
**Flavor:** Not the kill: the wound that slows them down, and you follow.

| | 1 AP |
|---|---|
| **Tier 1** | [B] [Mod] Pi |
| **Tier 2** | [B] 1d6 + [Mod] Pi |
| **Tier 3** | [B] 1d8 + [Mod] Pi; Bleed 1d4 (Bo/In). |

Worth: 5.5 to 6.1 DE (efficiency 1.17 to 1.32, as the Bleed lasts 1 to 2 turns), plus the AP the target spends staunching. On target.

**Lucas (round 3 of the Hunting Bow):** the bleeding creature always rolls; healing doesn't end Bleed (both written above). The Hunting Bow
is confirmed. **"Horse Bow" is a bad name** (it reads as mounted combat, written last): the second Basic bow is the **Recurve Bow**
(research: a recurve can be a wooden self bow or a composite; the short recurve is the light, quick bow of the moving archer).

## Bow 2: the Recurve Bow (Basic), to confirm

**The real weapon:** a short bow whose tips curve away from the archer, so a short, light bow still casts an arrow well: easy to carry and
to shoot while moving, from cover to cover. Its arrows are lighter than a longbow's.

| Group | Gate | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---|---:|
| Bows | Basic (Group Mastery 0) | Projectile, Ranged, Strung | Pierce | 6 / 12 / 18 | [B] 0 / 1d4+1 / 1d8+1 | 4.51 DE |

| Mastery | About | Unlock |
|---:|---|---|
| 3 | session 2 to 3 | **Skirmish Shot** (Weapon Technique, below). |
| 8 | level 2 | **Light Feet:** while you hold the Recurve Bow in both hands, your Speed is 1 higher. |
| 14 | level 4 | **Shot on the Run:** once each round, when you Advance, you can stop at any point of the movement to make a [Shot] Action with it (paying its AP), then finish the movement. |
| 20 | level 5 | **Skirmisher:** Skirmish Shot's Evade 1 also happens on a Tier 2. |
| 28 | level 7 | **Hit and Run:** Skirmish Shot's Evade is Evade 2. |

**Skirmish Shot** (1 AP, Weapon Technique; *Ranged • Shot • Strike • Weapon*; Round; One creature; Distance: Weapon; Vs: AD)
**Flavor:** Loose, and be gone before the arrow lands.

| | 1 AP |
|---|---|
| **Tier 1** | [B] [Mod] Pi |
| **Tier 2** | [B] 1d4 + 1 + [Mod] Pi |
| **Tier 3** | [B] 1d8 + 1 + [Mod] Pi; you can Evade 1. |

**Worth (prices.md):** Skirmish Shot 5.65 DE, efficiency 1.21 (on target); with Skirmisher 6.65, 1.43 (a little over: that is why it waits
for level 5, not 8). Light Feet and Shot on the Run are movement (priced by the map model when the bow is built in the ruler).
**Against the Hunting Bow:** the same damage; the Hunting Bow wins standing still and in close quarters, the Recurve Bow while moving
(shorter range: 6 instead of 8).

**Lucas (Recurve Bow, round 1):** Skirmish Shot is lame (a Weapon Attack with other dice): **a Technique must feel good, almost unique**;
use everything the system has (Setup, Versions, Lines: Lucas has their rules). **Shot on the Run is already RAW** (Chapter 3: you can split an
Advance and use other Actions between its parts): removed. Restart with the rules reread.

## The toolbox (what the rules already offer a weapon; reread 2026-10-31)

- **The card:** Versions (1 / 2 / 3 AP columns, "As 2 AP"), **Setup** (movement or an effect before the roll: Cut Through's Evade 2 through
  creatures), **Requirements**, a **Critical** row (Doubles on a Tier 3, or 20 over the DC), the **Effects** row (Tier 2 and 3), Linked Actions
  ("Weapon Attack (1A)"), **Reactions** (Interrupt before / Trigger after; 0R and 1R; a Critical that **disrupts**), Frequencies (At-will with
  its Banes, Turn, Round, Encounter, Daily), an Escalation cost.
- **Rolls:** Boons and Banes, Favored and Doomed, Save Actions (the targets roll; [Mod] on Tier 1 and 2), several targets rolled once.
- **Movement:** Advance (splittable), Evade (no Reactions, not splittable), Charge, straight lines, Pushed / Pulled / Slid / Reposition,
  Collision (damage for unused squares), Steadiness, Difficult and Hazardous Terrain ([HT: ...] areas), Imperiled (Deadly Hazards).
- **The battlefield:** Line of Effect, **Cover** (1 to 3 Banes by blocked corners; a creature in the way is Low cover), **Leaning**,
  Engaged (2 Banes on [Ranged] Actions; 1 against a target Engaged with someone else), **Flanking**, Reach and Range (Long), Light and
  Senses (Obscured, Hidden, Unsensed; Areas ignore them).
- **Areas:** Emanation, Burst, Aura, and **Lines and Cones (Lucas's rules: to come)**; Line of Effect and Cover from the Point of Origin.
- **Effects:** damage on two pools, Cleave, Guard, **Bleed** (new), Hindered, Immobilized, Prone, Vulnerable, Empowered / Enfeebled,
  Slowed / Quickened, losing or gaining AP now, Reload Shots (Favored, Empowered 2), the mark (a class's: Marked Quarry).

**Found in the reread:** the Archer's **Rolling Shot** is already "Evade 1 to 3, then a Weapon Attack": a Technique that is a Setup Evade +
a Shot would copy the Archer's Hallmark. A bow Technique should do what no card does yet: react (an Interrupt), shape an area (a Line),
play with Cover (a shot that ignores it, or arcs over it), move the target, or change the AP economy.

**Lucas:** the Line pack runs after the bows; its rules are decided (book/line-area-prompt.md) and the trees can use **Line N** (it always
starts from you, no range Banes inside it, creatures in it give no cover to each other, it stops at a wall, 1 square high).

## Bow 1 rebuilt: the Hunting Bow (Basic), to confirm

**What changed:** Wounding Shot gets a 2 AP Version that makes even a graze bleed, and a Critical; Steady Hands (a plain "ignore a Bane")
becomes **Patient Shot**, a Reaction: the hunter who waits for the prey to step into the open. Close Quarters, Quick Nock and Blood Trail stay.

| Group | Gate | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---|---:|
| Bows | Basic (Group Mastery 0) | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [B] 0 / 1d6 / 1d10 | 4.51 DE |

| Mastery | About | Unlock |
|---:|---|---|
| 3 | session 2 to 3 | **Close Quarters:** while you are Engaged, [Ranged] Actions with it take 1 Bane for it instead of 2. |
| 8 | level 2 | **Wounding Shot** (Weapon Technique, 1 / 2 AP, below). |
| 14 | level 4 | **Quick Nock:** once each turn, you draw or stow it without the Interact Action. |
| 20 | level 5 | **Blood Trail:** the Bleed of your Wounding Shot has DC 15, and a creature bleeding from it is never Unsensed by you. |
| 28 | level 7 | **Patient Shot** (a Reaction, below). |

<div class="action" markdown="1">
<div class="action-head"><span>Wounding Shot</span><span>1 / 2 AP</span><span class="cat">Weapon Technique</span></div>

**Flavor:** Not the kill: the wound that slows them down, and you follow.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

| | 1 AP | 2 AP |
|---|---|---|
| **Tier 1** | [B] [Mod] Pi | [B] [Mod] Pi; Bleed 1d4 (Bo/In). |
| **Tier 2** | [B] 1d6 + [Mod] Pi | [B] 1d6 + [Mod] Pi; Bleed 1d6 (Bo/In). |
| **Tier 3** | [B] 1d8 + [Mod] Pi; Bleed 1d4 (Bo/In). | [B] 1d10 + [Mod] Pi; Bleed 2d4 (Bo/In). |
| **Critical** | The wound won't close: only a Tier 3 on the Save ends this Bleed. | As 1 AP. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Patient Shot</span><span>1R</span><span class="cat">Hunting Bow 28</span></div>

**Flavor:** You waited. It stepped out. That was enough.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** The triggering creature

**Distance:** Weapon

**Trigger:** An enemy within your Hunting Bow's normal range stops moving in a square where it has no Cover from you (it ends its movement there, or uses another Action there).

| 1R |
|---|
| Make a [Ranged, Shot] Weapon Attack (1A) against the triggering creature. |

</div>

**Worth (Bleed lasting 1.5 of the target's turns, the middle of "staunched at once" and "left alone"):** Wounding Shot 1 AP 5.8 DE,
efficiency 1.24; **2 AP 10.5 DE, 1.13** (0.93 if staunched at once, 1.32 if left alone): on target. The 2 AP Version is the bleed shot (its
damage is mostly the Bleed, and a Tier 1 still bleeds); the 1 AP is the shot you mix into a turn. Bleed doesn't add up (the higher stays), so a
second Wounding Shot on a bleeding target only helps if its Bleed is bigger. Patient Shot is a Weapon Attack for AP you kept, once a round,
at the moment the prey shows itself (Cover: checked as for any Action).

**Why it should feel good:** a Tier 1 that still wounds; a Critical that makes the wound a problem (only a Tier 3 stops it: 19 to 27%);
the trail (never Unsensed) and the Reaction tie it to hunting: wound, follow, wait.

**To confirm:** the 2 AP Version and its numbers, the Critical, Patient Shot instead of Steady Hands (or keep both and drop Quick Nock).

**Lucas (Hunting Bow rebuilt): confirmed** ("the system thrives on multiple actions and variance"). **New: bows are held in one hand** and
need the other hand to shoot; with something in the other hand they take Banes. Proposal (to confirm): a new property **Draw** (or
"Strung"): "You hold a Draw weapon in one hand. Its [Strike] Actions need your other hand free to draw: with something in that hand, they
take 3 Banes (as a Two-handed weapon held with one hand)." Bows lose Two-handed and get Draw (their damage was already at the one-handed
level, 4.5). Unlike Two-handed: carrying the bow leaves a hand free (Handle Actions, Fists) with no Release / Interact to regrip, and the Banes
are only on the bow's own Strikes, not on another weapon's. Crossbows and the Musket stay Two-handed. To settle with it: the off-hand Bane
(D2 answer 5) doesn't apply to a Draw weapon (it is held in one hand and drawn with the other).

**Lucas:** the property is called **Strung**. A bow can be used from the off hand (a dagger in the main hand, the bow in the off hand): 3 Banes
(the other hand is full) + the off-hand Banes = 5, "which is fair". **My note:** a real archer holds the bow in the off hand and draws with
the main hand, so the off-hand Bane should not hit the normal way of shooting: proposed, **a Strung weapon takes the off-hand Bane only when
the other hand holds something** (bow in the off hand, main hand free: 0 Banes; dagger in the main hand: 3 + off-hand). A Hunting Bow
Weapon Attack: 4.51 DE (0 Banes), 3.61 (2), 3.20 (3), 2.83 (4), **2.49 (5: a hit 41% of the time, a Tier 3 13%)**.

**Lucas: all decided.** **Strung** (property, for every bow): "You hold a Strung weapon in one hand. Its [Strike] Actions need your other
hand free to draw: if that hand holds something, they take 3 Banes." The bows' tables above now say Strung instead of Two-handed (their
damage stays at the one-handed level). **The off-hand Bane is 2, and 1 for light weapons** (the Daggers group); **a Strung weapon takes it
only when its other hand holds something** (a bow in the off hand with the main hand free: no Bane; with a dagger in the main hand: 3 + 2 = 5).
Crossbows and the Musket stay Two-handed.

## Bow 2 rebuilt: the Recurve Bow (Basic), to confirm

**Its idea:** the archer who never stands still, built around a **Reaction** (the Archer's Rolling Shot already is "Evade, then shoot" on your
turn): you take the hit, step back and shoot (the "Parthian shot": loosing while you pull away).

| Group | Gate | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---|---:|
| Bows | Basic (Group Mastery 0) | Projectile, Ranged, Strung | Pierce | 6 / 12 / 18 | [B] 0 / 1d4+1 / 1d8+1 | 4.51 DE |

| Mastery | About | Unlock |
|---:|---|---|
| 3 | session 2 to 3 | **Light Feet:** while you hold the Recurve Bow, your Speed is 1 higher. |
| 8 | level 2 | **Parthian Shot** (Weapon Technique, a Reaction, 1R / 2R, below). |
| 14 | level 4 | **Turn and Loose:** Parthian Shot can also trigger when an enemy **stops moving in a square adjacent to you** (it ends its movement there, or uses another Action there: a creature that only passes by doesn't trigger it). |
| 20 | level 5 | **Second Wind:** once each encounter, you can use Parthian Shot's 1R Version as 0R. |
| 28 | level 7 | **Gone Before They Land:** Parthian Shot's Evades are 1 longer (Evade 2 / Evade 3). |

<div class="action" markdown="1">
<div class="action-head"><span>Parthian Shot</span><span>1R / 2R</span><span class="cat">Weapon Technique</span></div>

**Flavor:** You give ground, turn in the step, and the arrow is already on its way.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** The triggering creature

**Distance:** Weapon

**Trigger:** A creature makes a [Melee, Strike] Action against you.

| 1R | 2R |
|---|---|
| Evade 1, then make a [Ranged, Shot] Weapon Attack (1A) against the triggering creature. | Evade 2, then make a [Ranged, Shot] Weapon Attack (1A) with 1 Boon against the triggering creature. |
| **Critical:** The triggering creature is Hindered (EoT): it can't follow you this turn. | As 1R. |

</div>

**Why a Trigger, not an Interrupt:** an Interrupt would let you Evade out of the Strike before it lands: every melee attack against you would
be disrupted. As a Trigger you take the hit, then pull away and answer; after the Evade you are usually no longer Engaged, so the Shot has
no Engaged Banes (Close Quarters is the Hunting Bow's way; this is the Recurve's).
**Worth:** a Weapon Attack (4.51) and an Evade for AP you kept: 1R about 5.5 DE (the Evade saves the step away on your next turn, and the
Engaged Banes on the Shot); 2R about 9 DE with the Boon and the longer Evade: in the Round band for a Reaction. Light Feet and the Evades are
movement (the map model prices them when the bow goes into the ruler).
**The two Basic bows together:** the Hunting Bow acts on its turn (Wounding Shot, with variance in its Bleed) and waits (Patient Shot); the
Recurve reacts (Parthian Shot) and moves. Same damage, two ways to play.

**To confirm:** Parthian Shot as a Trigger with 1R / 2R, the Critical, and the ladder (Light Feet first, then the Technique).

**Lucas (Recurve Bow): confirmed**, with two changes (written above): **the off-hand wording**: "a Strung weapon in your off hand takes the
off-hand Bane only when your **main hand** holds something"; **"stops moving in a square"** instead of "ends a Move Action" (a split
Advance, Chapter 3, doesn't end where it pauses; a passer-by doesn't stop), used by Turn and Loose and, for the same reason, Patient Shot.
Note: Turn and Loose lets the archer step away before the melee Strike comes; the enemy can still finish a split Advance to close in again,
so it costs it movement, not the attack.

## Volley N, measured (the map model, every PC Shot of the simulated days, 2026-10-31)

| Shots within | 2 sq. | 3 | 4 | 5 | 8 | 12 |
|---|---:|---:|---:|---:|---:|---:|
| Share of the Shots | 3% | 7% | 12% | 20% | 52% | 92% |

So **Volley N costs little**: 1 Bane on 7% of the Shots (Volley 3) is about 0.7% of the bow's damage, Volley 5 about 2%. It is mostly
flavor (a heavy bow is bad up close) and a reason to stay back; it can't pay for much damage. A Longbow user who gets caught in melee pays more
than the average.

## Bow 3: the Longbow (Advanced), to confirm

**The real weapon:** the tall yew self bow of the English and Welsh archers: very heavy draws (the Mary Rose bows, about 100 to 185 lb), heavy
military arrows, shot in massed volleys at long range; arrows that fall from above on men behind cover.

| Group | Gate | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---|---:|
| Bows | Advanced (Group Mastery 6: it starts at 6 Mastery) | Projectile, Ranged, Strung, Volley 5 | Pierce | 12 / 24 / 36 | [B] 0 / 1d8 / 1d10 | 4.96 DE (+10%) |

**Volley N** (a new property): a [Strike] Action with it against a creature within N squares takes 1 Bane.

| Mastery | About | Unlock |
|---:|---|---|
| 9 | level 5 to 6 (from 6) | **Plunging Shot** (Weapon Technique, 1 / 2 AP, below). |
| 14 | level 6 | **Loose Together** (a Reaction, below): the volley. |
| 20 | level 7 | **Steady Draw:** your far range with it has no Bane. |
| 28 | level 8 to 9 | **Arrowfall:** Plunging Shot also ignores High Cover. |

<div class="action" markdown="1">
<div class="action-head"><span>Plunging Shot</span><span>1 / 2 AP</span><span class="cat">Weapon Technique</span></div>

**Flavor:** Up, over the wall, and down on the one who thought he was safe.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

**Requirements:** The target is at least 3 squares away.

| | 1 AP | 2 AP |
|---|---|---|
| **Tier 1** | [B] [Mod] Pi | [B] 1d6 + [Mod] Pi |
| **Tier 2** | [B] 1d8 + [Mod] Pi | [B] 1d8 + 1d6 + [Mod] Pi; Cleave 1. |
| **Tier 3** | [B] 1d10 + [Mod] Pi | [B] 1d10 + 1d6 + [Mod] Pi; Cleave 2. |
| **Effects** | The arrow falls from above: this Action ignores Low and Medium Cover (walls and creatures). | As 1 AP. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Loose Together</span><span>1R</span><span class="cat">Longbow 14</span></div>

**Flavor:** One command, one sky full of arrows.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** The creature the ally targeted

**Distance:** Weapon

**Trigger:** An ally within 5 squares of you makes a [Ranged, Strike] Action against a creature.

| 1R |
|---|
| Make a [Ranged, Shot] Weapon Attack (1A) with the Longbow against the same creature. |

</div>

**Worth:** Plunging Shot 1 AP 5.6 DE, efficiency 1.2; 2 AP 10.3 DE, 1.1 (the 2 AP Cleave counts a creature adjacent to the target 60% of
the time); ignoring cover adds about 0.1 a Shot on average, much more in the fights with walls. Both on target. Loose Together is a Weapon
Attack for AP you kept, once a round: with another archer in the party, a volley each round.
**Against the Basic bows at level 5:** +10% on every Weapon Attack and a longer reach (12 normal: most of a 25 x 25 map), the Hunting Bow
and Recurve Bow keep their mobility and bleed; the Longbow plays from behind the line, over cover, with its allies.

**To confirm:** Volley 5 (or drop Volley: it costs about 2%), the Requirement (3 squares), the 2 AP Version, Loose Together, and Arrowfall.

**Lucas (Longbow, round 1):** Cleave doesn't fit a bow (it is a big weapon cutting through). The parabola shot is good, but written as "ignore
cover" it is only that; **arcs are a thing TTRPGs leave to the GM** ("can I shoot over a creature, jump over it?"): the book should say you
can't, unless an ability says so (jumps will use the same rule later). Now, or only "ignores cover from creatures, objects, low walls"?

**Proposal: a short general rule now** (Chapter 3, after Cover; Plunging Shot is its first user, jumps later):

> **Arcs.** Shots, throws and jumps go in a straight line: you can't shoot, throw or jump **over** a creature or an obstacle unless an
> ability says the Action **arcs**. An Action that arcs passes over **low obstacles**, anything up to 1 square high (a crate, a barricade, a
> low wall, a creature of Size Medium or smaller): they give no Cover and don't block it. A **high arc** passes over anything up to 2 squares
> high. An arc needs room: the target must be at least 3 squares away, and the Action can't arc under a ceiling lower than 3 squares.

**Plunging Shot rewritten with it** (no Cleave): 1 AP **arcs**; 2 AP **arcs high** and deals 1d6 more. Worth: 1 AP about 5.6 DE (1.2),
2 AP about 9 DE (about 1.0, plus the cover it skips: High Cover is 3 Banes). **Arrowfall (28)** becomes: the 2 AP Version can target a
creature you can't perceive, if an ally within 5 squares of it perceives it (the volley called by a spotter).

**Lucas:** yes, a high arc passes over a full wall (Total Cover) up to 2 squares high. **Jumps:** a jumping creature should be able to
jump over a creature next to it. **The rule, revised:** the 3-square minimum is for **Shots and throws** (a missile needs distance to rise
and fall); **a jump that arcs** can start next to what it jumps over and land on the other side (a legal empty square), passing over a low
obstacle or a Medium or smaller creature (a high arc: up to 2 squares, a Large creature); its length comes from the ability ("Jump 3").
Passing over an unwilling creature this way is not Difficult Terrain (you don't go through its space); Reactions to movement still apply.
The ceiling rule (3 squares) is for every arc.

**Lucas (Longbow): confirmed**, with **Arrowfall** fixed: "the 2 AP Version can target a creature you can't perceive, if an ally within 5
squares of it perceives it **and your high arc can reach it** (nothing higher than 2 squares is in the way: a creature hiding behind a low
wall, not one behind a castle's keep)". Without the second part it would shoot through walls.

## Bow 4: the Composite Bow (Advanced), to confirm

**The real weapon:** horn on the belly, wood in the core, sinew on the back, in a recurve: a short bow with the power of a long one, the
war bow of the steppe. Its archers shot fast (several arrows held in the drawing hand, a thumb ring), and on the move. **Its idea: speed**,
one shot after another while it keeps landing (the system's variance), and the Recurve's movement with more force.

| Group | Gate | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---|---:|
| Bows | Advanced (Group Mastery 6) | Projectile, Ranged, Strung | Pierce | 10 / 20 / 30 | [B] 0 / 1d6 / 1d12 | 4.77 DE (+6%) |

| Mastery | About | Unlock |
|---:|---|---|
| 9 | level 5 to 6 | **Flurry of Arrows** (Weapon Technique, 1 / 2 AP, below). |
| 14 | level 6 | **Rider's Stride:** during Flurry of Arrows, you can Advance up to 2 between two of its Weapon Attacks. |
| 20 | level 7 | **Unbroken Rhythm:** the first Tier 1 of a Flurry of Arrows doesn't end it. |
| 28 | level 8 to 9 | **Storm of the Steppe:** the Weapon Attacks of a Flurry after the first can each target a different creature. |

<div class="action" markdown="1">
<div class="action-head"><span>Flurry of Arrows</span><span>1 / 2 AP</span><span class="cat">Weapon Technique</span></div>

**Flavor:** The next arrow is on the string before the first one lands.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

| 1 AP | 2 AP |
|---|---|
| Make a [Ranged, Shot] Weapon Attack (1A). On a Tier 3, make another one (1A) with 1 Bane. | Make [Ranged, Shot] Weapon Attacks (1A), one after another, up to three: each one after the first takes 1 more Bane (1, then 2), and a Tier 1 ends the Flurry. |

</div>

**Worth:** 1 AP 5.9 DE (efficiency 1.27); 2 AP 9.7 DE (1.04: on average 2.2 Weapon Attacks); with Unbroken Rhythm 12.5 (1.34, a little
over: a Stage 2 unlock). Its Weapon Attacks are Linked: they don't count toward the 3 Strikes or the At-will Banes; the Flurry itself is one
Strike. **Against the Longbow:** a little less damage on a Weapon Attack (+6% against +10%), more swing (one to three hits), and movement
(Rider's Stride); the Longbow has the reach, the arcs and the volley.

**To confirm:** the Flurry (1 / 2 AP), the ladder (Rider's Stride, Unbroken Rhythm, Storm of the Steppe).
