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
