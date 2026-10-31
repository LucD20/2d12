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
| Bows | Basic (Group Mastery 0) | Projectile, Ranged, Two-handed | Pierce | 8 / 16 / 24 | [B] 0 / 1d6 / 1d10 | 4.51 DE |

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
